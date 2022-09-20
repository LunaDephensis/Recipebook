/*const Pool = require('pg').Pool;
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASENAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});*/

let options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASENAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
};

const pgp = require('pg-promise')();

module.exports = pgp(options);