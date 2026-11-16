const express = require('express');
const path = require('path');
const session = require('express-session');
const { attachUser } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'shareshed-dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 }
}));
app.use(attachUser);

const pageRoutes = require('./routes/pageRoutes');
const memberRoutes = require('./routes/memberRoutes');
const toolRoutes = require('./routes/toolRoutes');
app.use('/', pageRoutes);
app.use('/', memberRoutes);
app.use('/', toolRoutes);

app.listen(PORT, () => {
  console.log(`ShareShed running at http://localhost:${PORT}`);
});