const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const passport = require("passport");

const passportJWT = require("passport-jwt");
const User = require("../models/user.model");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const localStrategy = require("passport-local").Strategy; // ***

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

// const app = express();
// app.use(passport.initialize());

router.post("/signup", async (req, res, next) => {
  passport.authenticate("signup", async (err, user, info) => {
    try {
      if (err || !user) {
        if (err.name === "MongoError" && err.code === 11000) {
          const { username, email, phone } = err.keyValue;

          let message = ` already exist`;

          if (username) {
            message = "Username" + message;
          } else if (email) {
            message = "Email" + message;
          } else if (phone) {
            message = "Phone" + message;
          }

          return res.status(401).json({ message: message });
        }

        return next(err);
      }

      res.json({
        message: "Signup successful",
        user: user,
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        // const error = new Error("An error occurred.");
        // return next(error);
        return res.status(401).json(info);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const payload = { id: user._id };
        const token = jwt.sign(payload, jwtOptions.secretOrKey);

        return res.json({ message: "ok", token: token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user;
    console.log("user: ", user);

    res.status(200).json(user);
  }
);

// example on medium
// router.post(
//   "/signup",
//   passport.authenticate("signup", { session: false }),
//   async (req, res, next) => {
//     res.json({
//       message: "Signup successful",
//       user: req.user,
//     });
//   }
// );

// *** from node-passport-jwt-example-app (github): ez to understand ***

// router.post("/login", async function (req, res) {
//   const { username, password } = req.body;

//   if (username && password) {
//     const user = await User.findOne({ username: username });

//     if (!user) {
//       res.status(401).json({ message: "no such user found" });
//     } else if (user.password === req.body.password) {
//       // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
//       const payload = { id: user._id };
//       const token = jwt.sign(payload, jwtOptions.secretOrKey);
//       res.json({ message: "ok", token: token });
//     } else {
//       res.status(401).json({ message: "invalid credentials" });
//     }
//   }
// });

// router.get("/", function (req, res) {
//   res.json({ message: "The app is running!" });
// });

// // router.get(
// //   "/secret",
// //   passport.authenticate("jwt", { session: false }),
// //   function (req, res) {
// //     res.json({ message: "Success!" });
// //   }
// // );

// // router.get(
// //   "/secretDebug",
// //   function (req, res, next) {
// //     console.log(req.get("Authorization"));
// //     next();
// //   },
// //   function (req, res) {
// //     res.json("debugging");
// //   }
// // );

module.exports = router;
