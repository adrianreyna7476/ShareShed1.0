const memberService = require('../services/memberService');

function attachUser(req, res, next) {
  res.locals.currentUser = null;
  if (req.session.memberId) {
    res.locals.currentUser = memberService.findById(req.session.memberId) || null;
  }
  next();
}

function requireLogin(req, res, next) {
  if (!res.locals.currentUser) {
    return res.redirect('/login');
  }
  next();
}

function requireManager(req, res, next) {
  if (!res.locals.currentUser) {
    return res.redirect('/login');
  }
  if (res.locals.currentUser.role !== 'manager') {
    const err = new Error('Only managers can view this page.');
    err.status = 403;
    return next(err);
  }
  next();
}

module.exports = { attachUser, requireLogin, requireManager };