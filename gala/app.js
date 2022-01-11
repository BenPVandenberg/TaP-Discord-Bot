const express = require("express");
const logger = require("morgan");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const https = require("https");
const fs = require("fs");

const indexRouter = require("./routes/index");
const soundsRouter = require("./routes/sounds");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(
    bodyParser.urlencoded({
        limit: "10mb",
        parameterLimit: 100000,
        extended: true,
    })
);
// app.use(cors({ origin: ["https://tandp.me"], optionsSuccessStatus: 200 }));
app.use(cors());
app.use(
    fileUpload({
        limits: { fieldSize: 50 * 1024 * 1024 },
        abortOnLimit: true,
        // useTempFiles: true,
    })
);

app.use("/", indexRouter);
app.use("/sounds", soundsRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

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

// app.listen(process.env.PORT || 5000, () => {
//     console.log(
//         `Example app listening at http://localhost:${process.env.PORT || 5000}`
//     );
// });

const server = https.createServer(
    {
        key: fs.readFileSync(process.env.SERVER_KEY),
        cert: fs.readFileSync(process.env.SERVER_CERT),
    },
    app
);

server.listen(process.env.PORT || 5000);
