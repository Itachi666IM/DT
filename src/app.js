const express = require("express")
// First we include the library express
const app = express()
// This is to create an instance 'app' using the express functionality of node.js

const fs = require("fs")
// This is to write on the output.txt, this is just to check whether we are getting the correct data or not
// Later I added the data directly to the database so we don't need this now. 
// We still need this for getting the nodes so don't remove it

const hbs = require("hbs")
// Hbs is a another feature which we can use to easily manipulate data on the frontend of our programs

const http = require("http")
const server = http.createServer(app)
// Http is use to create a server which we can connect with, alternatively we can also use app.listen() but this is a bit more precise

const socketio = require("socket.io")
global.io = socketio(server)
//This is a socket which is used to communicate with the front-end of our application
//I gave this a global scope so that it can be accessed in any file of our application

const path = require("path")
const static_path = path.join(__dirname,"../public")
app.use("/static",express.static(static_path))
// This is to make our life easier and to avoid unnecessary path errors
// We make a static path and add it to our public, now we simply use /static wherever we need to call public files

app.set("view engine", "hbs")
// This is done to tell our backend that the front-end is of hbs format
// Also it is important to note that all the hbs files must be in 'views' folder for this to work

app.use(express.urlencoded({extended:true}));
// For submitting the form we use this feature
// We add a parameter extended:true so that the form accepts all kinds of extended data (objects, custom data structures etc.)


let db = async()=>{ require("./database/connection")}
//we are connecting with the database

const {add_data} = require("./database/login_write")
//we want to use the add_data function so we are importing it from login_write file

const read = require("./database/login_read")
//to read the datatbase

const reportRead = require("./database/report_read");
//to read the finalreport table

const writeMachine = require('./database/writeMachine')
//similar to login_write

const readMachine = require('./database/readMachine'); 
//Here we are importing the readMachine module 

const {Isconnected} = require("./opcua/connect")
//To check whether we can connect to machine or not I have written a function

const getnodes = require("./opcua/getnodes")
//This is to get all the nodes from device

const dt = require("./opcua/DT_home");
//This is to create DT

const {del} = require("./database/logs_delete");
// Since we are storing all the login data in the table, it can become quite large
// This feature allows the user to clear the table with a click of a button

const starttime = require("./analytics/starttime");
//To calculate the starttime

const endtime = require("./analytics/endtime");
//To calculate the endtime

const {add} = require("./database/report_write");
//To write into finalreport table

app.get("/", function(req,res){
res.render("home")
})
//This is how we open our HTML/HBS file using node.js

app.get("/home",(req,res)=>{
  res.render("home")
})
//Just rendering home

app.get("/help",(req,res)=>{
  res.render("help")
})
//Just rendering help

app.post('/delete', (req, res) => {
  try {
    del();
    res.redirect('/logs'); // Redirect to the 'logs' page after clearing log data
  } catch (error) {
    console.error('Error while deleting log data:', error);
    res.render('error_page', { message: 'An error occurred while clearing log data.' });
  }
});
//To clear existing log data

app.post("/", function (req, res) {
  const name = req.body.name;
  const password = req.body.password;
  add_data(name,password)  
  if(name==="Admin" && password ==="abcd1234")
  {
    res.render("login_success")
  }
  else
  {
    res.render("login_fail")
  }
  });
//We are getting the data from the front-end and then entering into the database
//This is done to keep a record of who is trying to login
//We then check if the username and password matches the pre-determined values
//Accordingly we render required pages  
//There is obviously a more efficient way of doing this rather than loading seperate pages we could have just alerted the user
//It can be easily changed so it's not that big of an issue

app.get("/login", (req,res)=>{
  res.render("login")
})
//Now we can call this page again and again

app.get("/hmi",(req,res)=>{
  res.render("hmi")
})
//Similar to login page
let machine_ip = null;
app.post("/connection", async (req, res) => {
  machine_ip = req.body.machine;
  try {
    const connected = await Isconnected(machine_ip);
    
    if (connected) {
      console.log('Connected to the OPC UA server.');
      await getnodes.main(machine_ip);
       // Wait for main() to complete
      res.render("DT_home");
    }
    else
    {
      res.render("Con_fail");
    }
  } catch (err) {
    console.error('An error occurred:', err);
    res.render("Con_fail");
  }
});

//Now what we are doing is, whenever user enters the IP/name of the machine
//We check if we are able to connect with the machine or not
//Accordingly we render our pages
//This is a somewhat complex code where we are using async function and Promises in JavaScript
//This ensures us that we can surely connect to our machine
//the main() function gets all the nodes from our device and stores it in a text file as of now
//Later we will display all the nodes in the frontend so that the user can choose from them to make their DT
// We have extended this a bit, now even if the device doesn't have any node one can manually enter the sensor data

app.use("/logs",read)
//This is how we are reading the data from the database

let savedNames = []
//This array will contain the previously saved machine names

app.get('/Machine_info', async (req, res) => {
  try {
    // Retrieve saved machine names from the database
    const machineNames = await readMachine.getAllMachines();
    
    // Update the savedNames array with the data from the database
    savedNames = machineNames;
    
    // Render the 'Machine_info' template and pass the machineNames array
    res.render('Machine_info', { savedNames });
  } catch (err) {
    console.error('Error retrieving machine names:', err);
    res.redirect('/Machine_info');
  }
});
//Here we are rendering Machine_info

app.post("/save", (req,res)=>{
  const mname = req.body.machine;
  writeMachine.insertMachine(mname,(err,results)=>{
    if(err){
      console.log("Error while Inserting machine name:", err);
      res.redirect('/Machine_info');
    }
    else{
      console.log("Machine name entered successfully");
      res.redirect('/Machine_info');
    }
  });
});
//Here we are writing in the database the name of the new machine entered

app.get('/remove-name', (req, res) => {
  const rname = req.query.name;
  
  // Remove the selected machine name from the database
  writeMachine.removeMachine(rname, (err) => {
    if (err) {
      console.error('Error removing machine name from the database:', err);
    } else {
      console.log('Machine name removed successfully from the database');
      
    }
    // Update the machineNames array by filtering out the removed name
    savedNames = savedNames.filter((name) => name !== rname);
    // Redirect to the Machine_info page
    res.redirect('/Machine_info');
  });
});
//Here we are removing the machine name from the database as well as the array


app.get("/mi", (req, res) => {
  const index = req.query.index;
  const n = savedNames[index];
  console.log(`Index received : ${index}`);
  res.render("mi", { n });
});
// Here we are rendering the mi page with device name passed to the front-end where we will access it
// This mi page is where we are entering hardware information
// I plan to use this same information for the user to enter nodes

let treeData = null;

// Define a route to handle device information submission
app.post("/devinfo", (req, res) => {
  treeData = JSON.parse(req.body.treeData);
  console.log(treeData);
  res.render("hmi");
});

// Define a route to serve the tree data
// For now this isn't working as expected due to errors from the front-end side, it will be fixed soon though hopefully
// A quick update, the sub-components couldn't get added. Maybe my approach was not right
// If someone takes up the project in the future then he/she can try to fix this

app.get('/treeData', (req, res) => {
  res.json(treeData); // Send the tree data as a JSON response
});
//We are sending the treeData as a JSON response to the front end

let final_tree = null;
let Tree = null;
let st = null;
let ed = null;
let start = 0;
let end = 0;

app.post('/ninfo',async(req,res)=>{
  final_tree = JSON.parse(req.body.ftree);
  console.log(final_tree);
  await dt.main(machine_ip,final_tree);
  Tree = dt.Tree;
  console.log(Tree);
  st = starttime.starttime();
  res.render('DT_home2');
  start = new Date().getTime();
})
//Here we are obtaining the nodes that were selected by the user from the frontend
//We are storing them in a variable called final_tree

app.get('/finalTree',(req,res)=>{
  res.json(Tree);
})
//We are sending the final_tree as a JSON response to the front end
//This is done so that we can iterate over the final_tree

app.post('/end',(req,res)=>{
  ed = endtime.endtime();
  end = new Date().getTime();
  const cycle_time = (end - start)/1000;
  const downtime = dt.downtime();
  const number_of_jobs = dt.numberOfJobs();
  const good_jobs = dt.goodJobs();
  add(st,ed,cycle_time,downtime,number_of_jobs,good_jobs);
  res.render('DT_end');
})
//This is the end of our DT
//Here I am just entering data into our database and rendering a page

app.get('/DT_end',(req,res)=>{
  res.render('DT_end');
})
//Just rendering DT_end

app.get('/DT_home2',(req,res)=>{
  res.render('DT_home2');
})
//Just rendering DT_home2

app.get('/Sensor',(req,res)=>{
  res.render('Sensor');
})
//Just rendering Sensor

app.use("/report",reportRead);
//This is to read the database

server.listen(3000, async() => {
  console.log("Listening to port 3000");
  await db();
});
//This starts our web server with the given port
//All we need to do is type "node src/app" in the terminal
//'src/app' is the file path, and node is the command used to run this file
//After that we open any browser window and type "localhost:3000"
//Here 3000 is the port number
