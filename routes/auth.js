const express = require("express");
const router = express.Router();
// const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require("../models/user.model");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = "mySecretWord";

const strategy = new JwtStrategy(jwtOptions, async function (
  jwt_payload,
  next
) {
  console.log("payload received", jwt_payload);
  // usually this would be a database call:
  //  const user = users[_.findIndex(users, { id: jwt_payload.id })];
  const user = await User.findById(jwt_payload.id);

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

const app = express();
app.use(passport.initialize());

// // parse application/x-www-form-urlencoded
// // for easier testing with Postman or plain HTML forms
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );

// // parse application/json
// app.use(bodyParser.json());

router.post("/login", async function (req, res) {
  const { username, password } = req.body;

  if (username && password) {
    const user = await User.findOne({ username: username });

    if (!user) {
      res.status(401).json({ message: "no such user found" });
    } else if (user.password === req.body.password) {
      // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
      const payload = { id: user._id };
      const token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({ message: "ok", token: token });
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  }
});

router.get("/", function (req, res) {
  res.json({ message: "The app is running!" });
});

router.get(
  "/secret",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    res.json({ message: "Success!" });
  }
);

router.get(
  "/secretDebug",
  function (req, res, next) {
    console.log(req.get("Authorization"));
    next();
  },
  function (req, res) {
    res.json("debugging");
  }
);

module.exports = router;
