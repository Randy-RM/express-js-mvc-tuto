const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const UserModel = require("../models/user.model");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      const user = await UserModel.findOne({ email: jwt_payload.email });

      if (user) {
        return done(null, user);
      }

      return done(null, false);
    })
  );
};
