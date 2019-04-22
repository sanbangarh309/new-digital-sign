const LocalStrategy = require('passport-local').Strategy;

const User = require.main.require('./user').models.user;

const options = {
    usernameField: 'email',
};

const strategy = new LocalStrategy(options, (email, password, done) => {
    User.findOne({'email': email}).then((userMatched) => {
        if (!userMatched) {
            return done(null, false);
        }

        userMatched.comparePassword(password).then((res) => {
            if (!res) return done(null, false);
            return done(null, userMatched);
        }).catch((err) => done(err));
    }).catch((err) => done(err));
}
);

module.exports = strategy;
