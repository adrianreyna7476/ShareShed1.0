const memberService = require('../services/memberService');
const toolService = require('../services/toolService');
const loanService = require('../services/loanService');
const reservationService = require('../services/reservationService');
const damageService = require('../services/damageService');
const { setFlash } = require('../middleware/flash');

function showDashboard(req, res) {
  const openLoans = loanService.getOpenLoans();

  res.render('manager', {
    title: 'Manager Dashboard',
    members: memberService.getAllMembers(),
    tools: toolService.getAllTools(),
    openLoans,
    overdueCount: openLoans.filter(l => l.isOverdue()).length,
    pendingReservations: reservationService.getPendingReservations(),
    openReports: damageService.getOpenReports(),
    resolvedReports: damageService.getAllReports().filter(r => !r.isOpen()),
    getTool: toolService.getToolById,
    getMember: memberService.findById
  });
}

function resolveReport(req, res) {
  try {
    const reportId = parseInt(req.params.id, 10);
    const report = damageService.resolveReport(reportId, (req.body || {}).decision);
    setFlash(req, 'success', `Damage report #${report.id} ${report.status}. The tool is back in inventory.`);
  } catch (err) {
    setFlash(req, 'error', err.message);
  }
  res.redirect('/manager');
}

module.exports = { showDashboard, resolveReport };
