
require('ts-node').register()

module.exports = require('phoenix-api-lib').knexConfig('api', __dirname)