function showHome(req, res) {
  res.render('index', { title: 'Home' });
}

function showAbout(req, res) {
  res.render('about', { title: 'About' });
}

module.exports = { showHome, showAbout };