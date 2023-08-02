const {
    OPCUAClient,
    AttributeIds,
    TimestampsToReturn,
    StatusCodes,
    DataType
} = require("node-opcua");

const endpointUrl = "opc.tcp://140.140.140.20:4334";

let plcClient = new Promise(function(myResolve, myReject) {
    const client = OPCUAClient.create({
        endpointMustExist: false,
        connectionStrategy: {
            maxRetry: 2,
            initialDelay: 0,
            maxDelay: 10 * 1000
        }
    });
    client.on("backoff", () => console.log("retrying connection"));

    client.connect(endpointUrl)
    .then(()=>{
        console.log('Connected to SMC')
        myResolve(client);
    })
    .catch(err=>{
        console.log('Something failed : ', err)
        myReject();
    })
});
  
module.exports = plcClient