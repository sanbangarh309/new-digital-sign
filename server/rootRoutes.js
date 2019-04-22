const fs = require('fs');
const path = require('path');

const winston = require('winston');

// List all routes.js files in all modules if present
const getModuleRouteFiles = (source) =>
    fs.readdirSync(source)
        .map((name) => path.join(source, name))
        .map((name) => path.join(name, 'routes.js'))
        .filter(fs.existsSync);

module.exports = (app) => {
    // Import misc. routes
    require('./routes/doc')(app);
    require('./routes/sampleAuth')(app);

    // Import per-module routes
    getModuleRouteFiles(__dirname).forEach((path) => {
        winston.log('info', `[rootRoutes.js] Importing route ${path}`);
        require(path)(app);
    });
};
