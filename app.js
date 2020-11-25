var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var roleRouter = require('./routes/role');
var storeRouter = require('./routes/store');
var categoryRouter = require('./routes/categoryType');
var subCategoryRouter = require('./routes/subCategrory');
var configureRouter = require('./routes/appConfigure');
var flashRouter = require('./routes/flashMessage');
var imageRouter = require('./routes/image');
var clarityImageRouter = require('./routes/clarity');
var mongoose = require('mongoose');
var thateRouter = require('./routes/thateIdli');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
var mongoUrl = 'mongodb://localhost:27017/ThateIdli';

mongoose.connect(mongoUrl,{useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify:false},(err)=>{

  if(!err){
    console.log('Db Connected');
  }else{
    console.log('Db Not Connected'+err);
  }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/role',roleRouter);
app.use('/store',storeRouter);
app.use('/category',categoryRouter);
app.use('/subCategory',subCategoryRouter);
app.use('/configure',configureRouter);
app.use('/flash',flashRouter);
app.use('/image',imageRouter);
app.use('/clarity',clarityImageRouter);
app.use('/thatte',thateRouter);
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
