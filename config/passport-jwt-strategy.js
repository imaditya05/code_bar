const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJWt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");

let opts = {
  jwtFromRequest: ExtractJWt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "codebar",
};

passport.use(
  new JwtStrategy(opts, function (jwtPayLoad, done) {
    User.findById(jwtPayLoad._id, function (err, user) {
      if (err) {
        console.log("Error in finding user from JWT");
        return;
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

module.exports = passport;
