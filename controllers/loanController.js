const loanService = require('../services/loanService');
const reservationService = require('../services/reservationService');
const toolService = require('../services/toolService');
const { setFlash } = require('../middleware/flash');

function showMyTools(req, res) {
  const memberId = res.locals.currentUser.id;
  const reservations = reservationService.getReservationsForMember(memberId);
  const loans = loanService.getLoansForMember(memberId);

  res.render('my-tools', {
    title: 'My Tools',
    pendingReservations: reservations.filter(r => r.isPending()),
    openLoans: loans.filter(l => l.isOpen()),
    returnedLoans: loans.filter(l => !l.isOpen()),
    heldCount: reservationService.countHeldItems(memberId),
    holdLimit: reservationService.HOLD_LIMIT,
    dayOptions: reservationService.LOAN_DAY_OPTIONS,
    getTool: toolService.getToolById
  });
}

function showReturnForm(req, res) {
  try {
    const loanId = parseInt(req.params.id, 10);
    const loan = loanService.getOpenLoanForMember(res.locals.currentUser.id, loanId);
    res.render('return', {
      title: 'Return Tool',
      loan,
      tool: toolService.getToolById(loan.toolId),
      error: null
    });
  } catch (err) {
    setFlash(req, 'error', err.message);
    res.redirect('/my-tools');
  }
}

function handleReturn(req, res) {
  const loanId = parseInt(req.params.id, 10);
  const memberId = res.locals.currentUser.id;
  const body = req.body || {};
  const damaged = body.condition === 'damaged';

  try {
    const { loan, report } = loanService.returnLoan(memberId, loanId, {
      damaged,
      description: body.description
    });
    const tool = toolService.getToolById(loan.toolId);
    if (report) {
      setFlash(req, 'success', `${tool.name} returned. Damage report #${report.id} was sent to the manager.`);
    } else {
      setFlash(req, 'success', `${tool.name} returned. Thanks!`);
    }
    res.redirect('/my-tools');
  } catch (err) {
    try {
      const loan = loanService.getOpenLoanForMember(memberId, loanId);
      res.status(400).render('return', {
        title: 'Return Tool',
        loan,
        tool: toolService.getToolById(loan.toolId),
        error: err.message
      });
    } catch (lookupErr) {
      setFlash(req, 'error', lookupErr.message);
      res.redirect('/my-tools');
    }
  }
}

module.exports = { showMyTools, showReturnForm, handleReturn };
