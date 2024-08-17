const mysql = require('mysql');
require("dotenv").config();

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

const connection = (callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            callback(err);
        } else {
            connection.query('SELECT 1', (err) => {
                connection.release();
                callback(err ? err : null);
            });
        }
    });
};

const getquery = (query, params) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }

            connection.query(query, params, (err, result) => {
                connection.release();
                if (err) {
                    return reject(err);
                } else {
                    return resolve(result);
                }
            });
        });
    });
};

module.exports = {
    connection,
    getquery
};
