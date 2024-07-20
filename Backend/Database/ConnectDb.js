const mysql = require('mysql');
require("dotenv").config();

const pool=mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

const connection =(callback)=>{
    pool.getConnection((err,connection)=>{
        if(err){
            return callback("Connection err"+err);
        }
        connection.query('SELECT 1',(err)=>{
            if(err){
                connection.release();
                return callback("Query err"+err);
            } else{
                connection.release();
                return callback(null,connection);
            }

        });
    })
}

const getquery = (query, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback("Connection error: " + err.message);
        }

        connection.query(query, (err, result) => {
            connection.release(); // Always release the connection

            if (err) {
                return callback("Query error: " + err.message);
            } else {
                return callback(null, result);
            }
        });
    });
};

module.exports = {
    connection,
    getquery
}