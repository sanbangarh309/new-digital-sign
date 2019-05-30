/**
* @author Sandeep Bangarh <sanbangarh309@gmail.com>
*/
const path = require('path');
const winston = require('winston');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const nocache = require('node-nocache');
const timeout = require('connect-timeout');
const historyApiFallback = require('connect-history-api-fallback');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const devMode = process.env.NODE_ENV !== 'production';
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5200;
const config = require('./custom_config');
const WebpackConfigure = require('../webpack.config');

const auth = require.main.require('./auth');
const requireAuth = auth.passport.authenticate('jwt', {session: false});

// Configurations
// ================================================================================================
const app = express();
// Pass mode argument to config
const WebpackConfig = WebpackConfigure(process.env, {argv: {mode: process.env.NODE_ENV}});

// Set up Mongoose with centralized promise
mongoose.Promise = global.Promise;
mongoose.connect(devMode ? config.db_dev : config.db,{ useCreateIndex: true,useNewUrlParser: true }).then(() => {
    winston.log('info', 'Successfully connect with mongoose DB');
}).catch((err) => {
    winston.log('error', err);
});

// Set up middlewares
app.use(morgan('short')); // Show logs to users
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); // Parse POST contents
app.use(bodyParser.json({limit: '50mb'})); // Parse POST contents

/* *
 * NOTE: Important middlewares for this boilerplate!!!
 * Authorizations are checked through middleware here can
 * help to prevent attacks of scanning sensitive APIs.
    * */
app.use('/api/*', nocache); // Disable cache for all api requests
app.use('/api/auth/*', requireAuth); // Require authorization on all auth API calls

/* End of important middlewares */

// Setup timeout of 1 hour for all connections
app.use(timeout(60 * 60 * 1000));
app.use((req, res, next) => {
    if (!req.timedout) next();
});

// Include all the routes of modules
require('./rootRoutes')(app);

// For single page application with history api, add index file to fix it,
// e.g. /api/decreaseNum to /index.html/api/decreaseNum
app.use(historyApiFallback({verbose: false}));

// Rest routes to files/css/images/etc.
if (devMode) {
    // === Development settings ===
    const compiler = webpack(WebpackConfig);

    // Route to public files
    app.use(webpackDevMiddleware(compiler, {
        publicPath: WebpackConfig.output.publicPath,
        contentBase: path.resolve(__dirname, '../client/public'),
        hot: true,
    }));

    // Hot reloading
    app.use(webpackHotMiddleware(compiler));

    // Fallback routes
    app.use(express.static(path.resolve(__dirname, '../dist')));
    // === End of development settings ===
} else {
    // === Production settings ===
    // Main routes
    app.use(express.static(path.resolve(__dirname, '../dist')));

    // Fallback to index file if fail
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../dist/index.html'));
        res.end();
    });
    // === End of production settings ===
}

// Start server
app.listen(port, host, (err) => {
    if (err) winston.log('error', err);

    winston.log('info', '>>> 🌎 Open http://%s:%s/ in your browser.', host, port);
});

module.exports = app;
