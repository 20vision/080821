const {express} = require('./passwords')

const MYSQL = {
    MYSQL_URI: '34.76.172.176',
    MYSQL_USER: 'express',
    MYSQL_PASS: express,
    MYSQL_DATABASE: '20Vision'
};

const JWT = {
    JWT_SECRET: '0sm1GBXzMpX1k5E2YrpJyxohD6eoAYMd'
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