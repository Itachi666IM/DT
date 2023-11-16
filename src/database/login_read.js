const db = require("./connection");
const Router = require("express").Router();

Router.get('/',(req,res)=>{
    let sql = 'SELECT * FROM login;'
    
    let query = db.query(sql,(err,result)=>{
        if(err) throw err;

        res.render('logs',{
            login : result
        })
        }) 

})

module.exports = Router