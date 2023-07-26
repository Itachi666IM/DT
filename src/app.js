const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const http = require('http')
const server = http.createServer(app)

const static_path = path.join(__dirname,'../public')
app.use('/static', express.static(static_path))
app.set('view engine', 'hbs')

app.get('/',function(req,res){
    res.render('test')
})

server.listen(3000,()=>{
    console.log('Listening to port 3000')
})