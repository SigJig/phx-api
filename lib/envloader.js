
const path = require('path');
const { loadEnv } = require('./index');

const filepath = process.env.NODE_ENV_FILE || path.join(process.cwd(), '..');

loadEnv(filepath);