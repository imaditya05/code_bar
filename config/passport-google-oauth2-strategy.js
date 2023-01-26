const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");

passport.use(
  new googleStrategy(
    {
      clientID:
        "194903726526-7r5k8he951sfsn4f6kg0ln9510nf493f.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/users/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ email: profile.emails[0].value }).exec(function (
        err,
        user
      ) {
        if (err) {
          console.log("Error in google strategy-passport", err);
          return;
        }
        console.log(profile);
        if (user) {
          return done(null, user);
        } else {
          User.create(
            {
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"),
            },
            function (err, user) {
              if (err) {
                console.log("error in creating user google-passport strategy");
                return;
              } else {
                return done(null, user);
              }
            }
          );
        }
      });
    }
  )
);

module.exports = passport;
