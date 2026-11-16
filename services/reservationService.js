const toolService = require('./toolService');
const loanService = require('./loanService');

const HOLD_LIMIT = 2;
const PICKUP_DAYS = 2;
const LOAN_DAY_OPTIONS = [1, 3, 7, 14];
const DAY_MS = 1000 * 60 * 60 * 24;

class Reservation {
  constructor(id, memberId, toolId) {
    this.id = id;
    this.memberId = memberId;
    this.toolId = toolId;
    this.reservedDate = new Date();
    this.pickupBy = new Date(this.reservedDate.getTime() + PICKUP_DAYS * DAY_MS);
    this.status = 'pending';
  }

  isPending() {
    return this.status === 'pending';
  }

  isExpired() {
    return this.isPending() && new Date() > this.pickupBy;
  }
}

const reservations = [];
let nextId = 1;

function expireOldReservations() {
  reservations.forEach(r => {
    if (r.isExpired()) {
      r.status = 'expired';
      const tool = toolService.getToolById(r.toolId);
      if (tool) tool.setStatus('available');
    }
  });
}

function getPendingReservations() {
  expireOldReservations();
  return reservations.filter(r => r.isPending());
}

function getReservationsForMember(memberId) {
  expireOldReservations();
  return reservations.filter(r => r.memberId === memberId);
}

function countHeldItems(memberId) {
  const pending = getReservationsForMember(memberId).filter(r => r.isPending()).length;
  const onLoan = loanService.getOpenLoansForMember(memberId).length;
  return pending + onLoan;
}

function checkBorrowingRules(memberId) {
  if (loanService.hasOverdueLoan(memberId)) {
    throw new Error('You have an overdue tool. Return it before reserving another one.');
  }
  if (countHeldItems(memberId) >= HOLD_LIMIT) {
    throw new Error(`You can only hold ${HOLD_LIMIT} tools at a time.`);
  }
}

function reserveTool(memberId, toolId) {
  expireOldReservations();

  const tool = toolService.getToolById(toolId);
  if (!tool) {
    throw new Error('Tool not found.');
  }
  if (!tool.isAvailable()) {
    throw new Error(`${tool.name} is already reserved or on loan.`);
  }
  checkBorrowingRules(memberId);

  const reservation = new Reservation(nextId++, memberId, toolId);
  reservations.push(reservation);
  tool.setStatus('reserved');
  return reservation;
}

function getPendingReservationForMember(memberId, reservationId) {
  expireOldReservations();
  const reservation = reservations.find(r => r.id === reservationId);
  if (!reservation || reservation.memberId !== memberId) {
    throw new Error('Reservation not found.');
  }
  if (!reservation.isPending()) {
    throw new Error(`This reservation is ${reservation.status}.`);
  }
  return reservation;
}

function pickUpReservation(memberId, reservationId, days) {
  const reservation = getPendingReservationForMember(memberId, reservationId);
  if (!LOAN_DAY_OPTIONS.includes(days)) {
    throw new Error('Choose a valid loan period.');
  }
  if (loanService.hasOverdueLoan(memberId)) {
    throw new Error('You have an overdue tool. Return it before checking out another one.');
  }

  reservation.status = 'picked-up';
  const tool = toolService.getToolById(reservation.toolId);
  if (tool) tool.setStatus('on-loan');

  return loanService.createLoan(memberId, reservation.toolId, days);
}

function cancelReservation(memberId, reservationId) {
  const reservation = getPendingReservationForMember(memberId, reservationId);
  reservation.status = 'cancelled';
  const tool = toolService.getToolById(reservation.toolId);
  if (tool) tool.setStatus('available');
  return reservation;
}

module.exports = {
  Reservation,
  HOLD_LIMIT,
  LOAN_DAY_OPTIONS,
  getPendingReservations,
  getReservationsForMember,
  countHeldItems,
  reserveTool,
  pickUpReservation,
  cancelReservation
};
