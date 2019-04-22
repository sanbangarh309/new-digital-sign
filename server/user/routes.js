const User = require('./models/user');

async function fetchUserInfo(req, res, next) {
    const {user} = req;
    try {
        // Fetch user info from database for the latest result.
        const userMatched = await User.findById(user._id);

        if (!userMatched) {
            res.status(401).send({error: 'User not found'});
        } else {
            userMatched.removeSensitiveFields();
            res.json(userMatched);
        }
    } catch (err) {
        next(err);
    }
}

module.exports = (app) => {
    // JWT authorization of '/api/auth/' path is automatically handled by middlewares
    // We only need to verify the permissions if required.
    app.get('/api/auth/me', fetchUserInfo);
};
