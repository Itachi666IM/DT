const opcua = require('node-opcua')

const connectionStrategy = {
    initialDelay: 0,
    maxRetry: 2,
    maxDelay: 10*1000
}
// to set up a connection we have to define connectionStrategy object

const options1 = {
    connectionStrategy: connectionStrategy,
    endpointMustExist: false,
};
// to set up a client we have to define another object where one of the key will take connectionStraegy as value

const client = opcua.OPCUAClient.create(options1)
// now we make a client object using opcua funtion opcua.OPCUAClient.create

const endpoint = 'opc.tcp://'
// this statement connects us to the promoteToStateMachine, here we are connecting through IP address
// the complete IP will be entered by the user

async function Isconnected(machine_ip) {
    let complete_ip = endpoint + machine_ip;

    try {
        await client.connect(complete_ip);
        return true;
    } catch (err) {
        console.error('Error connecting to the OPC UA server:', err.message);
        return false;
    }
}
//This async function will check whether we can connect to the system or not
//Here we are getting the IP address of the machine from the user
//We then parse it into the required OPCUA string format and then use the .connect functionality
//'try' and 'catch' are used to check for any error while connecting

module.exports ={Isconnected}
//We then export this function to the our main file where we can use it to check for the connection




