// configuring the strategies for passport

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
  const user = await User.findById(jwt_payload.id);

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

// *** passport-local strategy for sign-up and log-in
passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const { email, phone } = req.body;
        const user = await User.add({ username, password, email, phone });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });

        if (!user) {
          return done(null, false, { message: "User not found!" });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: "Wrong password!" });
        }

        return done(null, user, { message: "Logged in successfully!" });
      } catch (error) {
        return done(error);
      }
    }
  )
);
// ___
