var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// passport
// const passport = require('passport');
// require('./passport-config')(passport);
// =================== connect to MongoDB =================================
const mongoose = require('mongoose');

const mongoDB = "mongodb+srv://erikhu:0x5TFIhuTx1gEj3s@marketplace.geayz.mongodb.net/marketplace";

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}
// =======================================================================

var createRouter = require('./routes/productcreate');
var productsRouter = require('./routes/products');
var authRouter = require('./routes/auth');
var editRouter = require('./routes/productedit');

var app = express();

//CORS
const cors = require('cors');
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/edit', editRouter);
app.use('/create', createRouter);
app.use('/', productsRouter);
app.use('/users', authRouter);



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
