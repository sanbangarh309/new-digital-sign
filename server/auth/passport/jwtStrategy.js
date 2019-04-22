const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const config = require.main.require('./custom_config');
// const User = require.main.require('./user').models.user;

const options = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.JWT_SECRET,
};

const strategy = new JwtStrategy(options, (payload, done) => {
    return done(null, {...payload.user, _id: payload.sub});
    /* Use this if you want to query the database for information
    User.findById(payload.sub).then((user) => {
        if (!user) return done(null, false);
        return done(null, user);
    }).catch((err) => done(err, false));
    */
});

module.exports = strategy;
