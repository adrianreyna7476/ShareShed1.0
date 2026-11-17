const express = require('express');
const path = require('path');
const session = require('express-session');
const { attachUser } = require('./middleware/auth');
const { showFlash } = require('./middleware/flash');
const { securityHeaders } = require('./middleware/security');
const { requestLogger } = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const memberService = require('./services/memberService');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(requestLogger);
app.use(securityHeaders);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'shareshed-dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 }
}));
app.use(attachUser);
app.use(showFlash);

const pageRoutes = require('./routes/pageRoutes');
const memberRoutes = require('./routes/memberRoutes');
const toolRoutes = require('./routes/toolRoutes');
const loanRoutes = require('./routes/loanRoutes');
const managerRoutes = require('./routes/managerRoutes');
app.use('/', pageRoutes);
app.use('/', memberRoutes);
app.use('/', toolRoutes);
app.use('/', loanRoutes);
app.use('/', managerRoutes);

app.use(notFound);
app.use(errorHandler);

async function startServer() {
  try {
    await memberService.createManagerAccount();
    app.listen(PORT, () => {
      console.log(`ShareShed running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('ShareShed failed to start:', err);
    process.exit(1);
  }
}

startServer();
