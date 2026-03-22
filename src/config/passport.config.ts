import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { PassportStatic } from "passport";
import UserModel from "../models/user.model";

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "",
};

export default (passport: PassportStatic): void => {
  passport.use(
    new JwtStrategy(options, async (jwtPayload, done) => {
      try {
        const user = await UserModel.findOne({ email: jwtPayload.email });
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};
