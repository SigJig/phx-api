
const path = require('path');

function loadEnv(filepath) {
    const { NODE_ENV = 'development' } = process.env;
    
    process.env.NODE_ENV = NODE_ENV.replace(/(^\s+|\s+$)/g, '');

    const envPath = path.join(filepath || __dirname, `.env.${process.env.NODE_ENV}`);
    const out = require('dotenv').config({path: envPath});
    
    console.log(`Using environment ${NODE_ENV}, .env path: ${envPath}`);
};

module.exports.loadEnv = loadEnv;

module.exports.knexConfig = function knexConfigFromEnv(db, filepath) {
    filepath = filepath || path.join(process.cwd(), '..', 'database');

    const prefix = `DB_${db.toUpperCase()}_`;
    const knexDir = path.join(filepath, db);

    const env = process.env.NODE_ENV && process.env.NODE_ENV.replace(/(^\s+|\s+$)/g, '');
  
    const envVars = ['CLIENT', 'CONNECT'].map(x => Reflect.get(process.env, prefix + x));
    
    if (envVars.indexOf(undefined) > -1) {
        throw new Error(`Bad .env loading - connection credentials are undefined (using env ${process.env.NODE_ENV})`);
    };

    const [ client, connection ] = envVars;
 
    return {
        client,
        connection,
        migrations: {
            directory: path.join(knexDir, 'migrations')
        },
        seeds: env && {
            directory: path.join(knexDir, 'seeds', env)
        },
        pool: {
            min: 2,
            max: 10
        }
    };
};
