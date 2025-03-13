var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv')
dotenv.config()

var session = require('express-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var kategoriRoutes = require('./routes/kategoriRoutes')
var produkRoutes = require('./routes/produkRoutes')
var registerRoutes = require('./routes/auth/register')
var loginRoutes = require('./routes/auth/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session ({
  cookie: {
    maxAge: 60000000
  }, 
  store: new session.MemoryStore,
  saveUninitialized: true,
  resave: 'true',
  secret: 'rahasia'
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/kategori', kategoriRoutes)
app.use('/api/produk', produkRoutes)
app.use('/api/register', registerRoutes)
app.use('/api/login', loginRoutes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
