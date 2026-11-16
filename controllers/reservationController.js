const reservationService = require('../services/reservationService');
const toolService = require('../services/toolService');
const { setFlash } = require('../middleware/flash');

function reserveTool(req, res) {
  try {
    const toolId = parseInt(req.params.id, 10);
    const memberId = res.locals.currentUser.id;
    reservationService.reserveTool(memberId, toolId);
    const tool = toolService.getToolById(toolId);
    setFlash(req, 'success', `${tool.name} is reserved for you. Pick it up within 2 days.`);
    res.redirect('/my-tools');
  } catch (err) {
    setFlash(req, 'error', err.message);
    res.redirect('/tools');
  }
}

function pickUp(req, res) {
  try {
    const reservationId = parseInt(req.params.id, 10);
    const days = parseInt((req.body || {}).days, 10);
    const memberId = res.locals.currentUser.id;
    const loan = reservationService.pickUpReservation(memberId, reservationId, days);
    setFlash(req, 'success', `Checked out. Due back ${loan.dueDate.toLocaleDateString()}.`);
  } catch (err) {
    setFlash(req, 'error', err.message);
  }
  res.redirect('/my-tools');
}

function cancel(req, res) {
  try {
    const reservationId = parseInt(req.params.id, 10);
    const memberId = res.locals.currentUser.id;
    reservationService.cancelReservation(memberId, reservationId);
    setFlash(req, 'success', 'Reservation cancelled.');
  } catch (err) {
    setFlash(req, 'error', err.message);
  }
  res.redirect('/my-tools');
}

module.exports = { reserveTool, pickUp, cancel };
