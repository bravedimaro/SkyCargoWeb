
const express = require('express');
const mysql = require('mysql');


// database connection and query promisify
var conn = mysql.createPool({
    host     : process.env.DB_HOST || 'localhost',
    user     : process.env.DB_USER || 'username',
    password : process.env.DB_PASS || 'password',
    database : process.env.DB_NAME || 'database',
    port     : process.env.DB_PORT || 3306,
    connectionLimit : 100,
    ssl        : {
        rejectUnauthorized: true
    }
  });


const mySqlQury =(qry, params)=>{
    return new Promise((resolve, reject)=>{
        const cb = (err, row)=>{
            if (err) return reject(err);
            resolve(row)
        }
        if (params) conn.query(qry, params, cb);
        else conn.query(qry, cb);
    })
}

  
module.exports = {conn, mySqlQury}