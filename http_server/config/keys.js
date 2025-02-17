const {express, jwt} = require('./passwords')

const MYSQL = {
    MYSQL_URI: express=='password'?'127.0.0.1':'34.77.7.101',
    MYSQL_USER: express=='password'?'root':'express',
    MYSQL_PASS: express,
    MYSQL_DATABASE: '20Vision'
};

const JWT = {
    JWT_SECRET: jwt
}

const CLOUDSTORAGE = {
    PROJECT_ID: 'backend-320420'
}

const KEYS = {
    ...MYSQL,
    ...JWT,
    ...CLOUDSTORAGE
};

module.exports = KEYS;