function notFound(req, res) {
  res.status(404).render('error', {
    title: 'Page Not Found',
    status: 404,
    message: 'The page you are looking for does not exist.'
  });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  if (status === 500) {
    console.error(err);
  }

  if (res.locals.currentUser === undefined) res.locals.currentUser = null;
  if (res.locals.flash === undefined) res.locals.flash = null;

  res.status(status).render('error', {
    title: status === 403 ? 'Access Denied' : 'Something Went Wrong',
    status,
    message: status === 500 ? 'Something went wrong on our end. Please try again.' : err.message
  });
}

module.exports = { notFound, errorHandler };
