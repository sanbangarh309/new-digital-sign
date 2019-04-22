const path = require('path');
const requireDir = require('require-dir');

const models = requireDir(path.join(__dirname, 'models'));
const routes = require('./routes');

module.exports = {models, routes};
