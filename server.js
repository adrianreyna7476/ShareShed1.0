const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const pageRoutes = require('./routes/pageRoutes');
app.use('/', pageRoutes);

app.listen(PORT, () => {
  console.log(`ShareShed running at http://localhost:${PORT}`);
});