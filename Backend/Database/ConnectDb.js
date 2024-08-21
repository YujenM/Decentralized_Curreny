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
            return callback("Connection error: " + err.message);
        }
        connection.query('SELECT 1', (err) => {
            connection.release();
            if (err) {
                return callback("Query error: " + err.message);
            }
            return callback(null, connection);
        });
    });
};

const getquery = (query, params) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(new Error("Connection error: " + err.message));
            }

            connection.query(query, params, (err, result) => {
                connection.release();

                if (err) {
                    return reject(new Error("Query error: " + err.message));
                } else {
                    resolve(result);
                }
            });
        });
    });
};

module.exports = {
    connection,
    getquery
};
