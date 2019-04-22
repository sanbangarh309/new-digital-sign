const passport = require('passport');
const LocalStrategy = require('./localStrategy');
const JWTStrategy = require('./jwtStrategy');

// ==== Register Strategies ====
passport.use(JWTStrategy);
passport.use(LocalStrategy);

module.exports = passport;
