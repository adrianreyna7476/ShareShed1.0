const toolService = require('./toolService');
const damageService = require('./damageService');

const DAY_MS = 1000 * 60 * 60 * 24;

class Loan {
  constructor(id, memberId, toolId, days) {
    this.id = id;
    this.memberId = memberId;
    this.toolId = toolId;
    this.checkoutDate = new Date();
    this.dueDate = new Date(this.checkoutDate.getTime() + days * DAY_MS);
    this.returnDate = null;
    this.status = 'active';
  }

  isOpen() {
    return this.returnDate === null;
  }

  isOverdue() {
    return this.isOpen() && new Date() > this.dueDate;
  }

  refreshStatus() {
    if (this.isOverdue()) {
      this.status = 'overdue';
    }
  }
}

const loans = [];
let nextId = 1;

function refreshAll() {
  loans.forEach(l => l.refreshStatus());
}

function createLoan(memberId, toolId, days) {
  const loan = new Loan(nextId++, memberId, toolId, days);
  loans.push(loan);
  return loan;
}

function getAllLoans() {
  refreshAll();
  return loans;
}

function getOpenLoans() {
  refreshAll();
  return loans.filter(l => l.isOpen());
}

function getLoansForMember(memberId) {
  refreshAll();
  return loans.filter(l => l.memberId === memberId);
}

function getOpenLoansForMember(memberId) {
  return getLoansForMember(memberId).filter(l => l.isOpen());
}

function hasOverdueLoan(memberId) {
  return getOpenLoansForMember(memberId).some(l => l.isOverdue());
}

function getOpenLoanForMember(memberId, loanId) {
  const loan = loans.find(l => l.id === loanId);
  if (!loan || loan.memberId !== memberId) {
    throw new Error('Loan not found.');
  }
  if (!loan.isOpen()) {
    throw new Error('This tool has already been returned.');
  }
  return loan;
}

function returnLoan(memberId, loanId, { damaged, description }) {
  const loan = getOpenLoanForMember(memberId, loanId);
  const tool = toolService.getToolById(loan.toolId);

  let report = null;
  if (damaged) {
    report = damageService.createReport(loan, description);
  }

  loan.returnDate = new Date();
  loan.status = 'returned';

  if (tool) {
    tool.setStatus(damaged ? 'under-repair' : 'available');
  }

  return { loan, report };
}

module.exports = {
  Loan,
  createLoan,
  getAllLoans,
  getOpenLoans,
  getLoansForMember,
  getOpenLoansForMember,
  hasOverdueLoan,
  getOpenLoanForMember,
  returnLoan
};
