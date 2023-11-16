const db = require('./connection');

function del(){
    let sql = `TRUNCATE TABLE login`
    let query = db.query(sql, (err,result)=>{
        if(err) throw err;
    })
}

module.exports = {del};