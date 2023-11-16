const mysql = require('mysql2')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Just123#Abc',
    database: 'new_schema'
})

db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log('connected to mysql')
})

module.exports = db