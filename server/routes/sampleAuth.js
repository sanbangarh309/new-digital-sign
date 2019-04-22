const auth = require.main.require('./auth');
const permission = auth.permission;

function sampleAuthMessage(req, res) {
    res.json({message: 'Hello User!'});
}

// JWT authorization of '/api/auth/' path is automatically handled by middlewares
// NOTE: We need to handle permission of accesses here
module.exports = (app) => {
    app.get('/api/auth/fetchMessage', permission.basic, sampleAuthMessage);
};
