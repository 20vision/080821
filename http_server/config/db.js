const mysql = require('mysql2');
var keys = require('./keys')

const pool = mysql.createPool({
  host: keys.MYSQL_URI,
  user: keys.MYSQL_USER,
  password: keys.MYSQL_PASS,
  database: keys.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0
});

module.exports = pool