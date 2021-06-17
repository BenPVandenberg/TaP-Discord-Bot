const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const fileUpload = require("express-fileupload");
const cors = require("cors");
require("dotenv").config();

const indexRouter = require("./routes/index");
const soundsRouter = require("./routes/sounds");
const dataRouter = require("./routes/data");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors()); // it enables all cors requests
app.use(
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 * 1024 },
        abortOnLimit: true,
    }),
);

app.use("/", indexRouter);
app.use("/sounds", soundsRouter);
app.use("/data", dataRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
