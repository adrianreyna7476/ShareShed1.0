function setFlash(req, type, text) {
  req.session.flash = { type, text };
}

function showFlash(req, res, next) {
  res.locals.flash = null;
  if (req.session && req.session.flash) {
    res.locals.flash = req.session.flash;
    delete req.session.flash;
  }
  next();
}

module.exports = { setFlash, showFlash };
