const db = require('./connection')

function add_data(name,password){
    var timestamp = new Date()
    timestamp = timestamp.toString()

    let post = {nam:name,pass:password,tim:timestamp}

    let sql = 'INSERT INTO login set ?'

    db.query(sql, post,(err,result)=>{
        if (err) throw err
        console.log('data entered successfully')
    })
}

module.exports = {add_data}