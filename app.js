var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { expressjwt } = require("express-jwt");
const cors = require('cors');

var articlesRouter = require('./routes/articles');
var usersRouter = require('./routes/users');
const uploadRouter = require('./routes/upload');
const commentsRouter = require('./routes/comments');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
//在所有路由之前添加jwt验证

app.use(
  expressjwt({
    secret: "test123456",
    algorithms: ["HS256"],
  }).unless({
    path: [
      "/api/users",
      "/api/upload",
      // "/api/articles/users/:uid", 这样的路由，必须使用正则匹配
      /^\/api\/articles\/users\/\w+/,
      {
        url: /^\/api\/articles\/\w+/,
        methods: ["GET"],
      },
    ],
  })
);

app.use('/api/articles', articlesRouter);
app.use('/api/users', usersRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/comments', commentsRouter);

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      code: 0, msg: "无效的token或者没有没有传递token-请重新登录"
    });

  } else {
    next(err);
  }
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // 记录更详细的错误信息，比如错误类型、错误消息、堆栈信息等
  console.error('全局捕获到文件上传错误:');
  console.error('错误类型:', err.name);
  console.error('错误消息:', err.message);
  console.error('堆栈信息:', err.stack);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
