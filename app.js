var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//require sequelize instance
const sequelize = require('./models/index.js').sequelize;

//Step 5 test connection
sequelize.authenticate()
  .then(() => {
    console.log("Successful Connection");
    return sequelize.sync()
  })
  .then(() => {
    console.log("Sync: good")
  })
  .catch(err => {
    console.log("Connection: bad", err);
  })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// Step 7 catch 404 and forward to error handler
app.use((req, res, next) => {
  console.log('404 error handler called');
  const err = new Error ('Error 404');
  err.status = 404;
  next(err);
});

//Step 7 error handler

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).render('page-not-found', {err});
    console.log('Error - page not found');
  } else {
    console.log('A server error has occurred, please try again.');
    err.message = err.message || `A server error has occurred, please try again.`;
    res.status(err.status || 500).render('error', {err})
  }
});


// export
module.exports = app;

// port listen
app.listen(3000, function(){
  console.log('running port 3000');
});