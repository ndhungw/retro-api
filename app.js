const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const boardsRouter = require("./routes/boards");
const columnsRouter = require("./routes/columns");
const cardsRouter = require("./routes/cards");
const authRouter = require("./routes/auth");
require("./db/database");
require("./configs/passport"); // pass passport for configuration

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize()); // required for passport

app.use("/", indexRouter);
app.use(
  "/users",
  passport.authenticate("jwt", { session: false }),
  usersRouter
);
app.use(
  "/boards",
  passport.authenticate("jwt", { session: false }),
  boardsRouter
);
app.use(
  "/columns",
  passport.authenticate("jwt", { session: false }),
  columnsRouter
);
app.use(
  "/cards",
  passport.authenticate("jwt", { session: false }),
  cardsRouter
);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
