const memberService = require('../services/memberService');

function showSignup(req, res) {
  res.render('signup', { title: 'Sign Up', error: null, formData: {} });
}

async function handleSignup(req, res) {
  try {
    const member = await memberService.registerMember(req.body);
    req.session.memberId = member.id;
    res.render('signup-success', { title: 'Welcome', member });
  } catch (err) {
    res.status(400).render('signup', {
      title: 'Sign Up',
      error: err.message,
      formData: req.body
    });
  }
}

function showLogin(req, res) {
  res.render('login', { title: 'Log In', error: null, email: '' });
}

async function handleLogin(req, res) {
  try {
    const member = await memberService.authenticate(req.body.email, req.body.password);
    req.session.memberId = member.id;
    res.redirect('/tools');
  } catch (err) {
    res.status(401).render('login', {
      title: 'Log In',
      error: err.message,
      email: req.body.email || ''
    });
  }
}

function handleLogout(req, res, next) {
  req.session.destroy(err => {
    if (err) return next(err);
    res.redirect('/');
  });
}

module.exports = { showSignup, handleSignup, showLogin, handleLogin, handleLogout };