const express = require('express');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const https = require('https');
const fs = require('fs');

const indexRouter = require('./routes/index');
const soundsRouter = require('./routes/sounds');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use('/', indexRouter);
app.use('/sounds', soundsRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404);

  next();
});

// error handler
app.use((err, req, res, next) => {
  // print the error stack
  console.error(err.stack);

  res.status(err.status || 500);
});

// Http Server
app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Example app listening at http://localhost:${process.env.PORT || 5000}`
  );
});

// Https Server
// const server = https.createServer(
//   {
//     key: fs.readFileSync(process.env.SERVER_KEY),
//     cert: fs.readFileSync(process.env.SERVER_CERT),
//   },
//   app
// );
// server.listen(process.env.PORT || 5000);
