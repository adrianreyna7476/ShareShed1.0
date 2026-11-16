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

module.exports = { attachUser, requireLogin };