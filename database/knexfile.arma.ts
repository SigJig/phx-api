
require('ts-node').register()

module.exports = require('phoenix-api-lib').knexConfig('arma', __dirname)
