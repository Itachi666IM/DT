const db = require("./connection");
const Router = require("express").Router();

Router.get('/',(req,res)=>{
    let sql = 'SELECT * FROM finalreport;'
    
    let query = db.query(sql,(err,result)=>{
        if(err) throw err;

        res.render('report',{
            finalreport : result
        })
        }) 

})

module.exports = Router