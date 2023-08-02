const opcua = require('node-opcua')
// we first install opcua library and access it using an object

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

// const client = OPCUAClient.create(options)

const endpoint = 'opc.tcp://140.140.140.20:4840'
// this statement connects us to the promoteToStateMachine, here we are connecting through IP address

async function main(){
    let quality = 0
    io.on('connection',(socket)=>{
        console.log('connected to sockets')
    })
    
    client.on('backoff',()=>{
        console.log('retrying connection')
    })
    
    await client.connect(endpoint)

    console.log('Connected to PLC');

    const session = client.createSession();

    // const subscription = await session.createSubscription2({
    //             requestedPubslishingInterval: 1000,
    //             requestedLifetimeCount: 100,
    //             requestedMaxKeepAliveCount: 10,
    //             maxNotificationPerPublish: 10,
    //             publishingEnabled: true,
    //             priority: 10
    // }
    // );

    const subscription = (await session).createSubscription2({
        requestedPublishingInterval: 1000,
        requestedLifetimeCount: 100,
        requestedMaxKeepAliveCount: 10,
        maxNotificationsPerPublish: 10,
        publishingEnabled: true,
        priority: 10
    })

    ;(await subscription)
        .on("started", ()=> console.log("subscription started - subscriptionId= ", subscription.subscriptionId))
        .on("keepalive", ()=> console.log("keepalive"))
        .on("terminated", ()=> console.log("subscription - terminated"));

    const itemToMonitor = {
        nodeId: "ns=4;s=CNY.SEN1",
        attributeId: opcua.AttributeIds.value
    };

    const parameters = {
        samplingInterval: 1,
        discardOldest: true,
        queueSize: 10
    };

    const monitor = (await subscription).monitor(itemToMonitor,parameters,opcua.TimestampsToReturn.Both)

    //if we use keepalive instead of changed I think the error which we were getting yesterday where it was only detecting
    //a change in value will be resolved 
    ;(await monitor).on("changed", (datavalue) =>{
        console.log(datavalue.value.value)
        io.sockets.emit("s1",{
            sensorData : datavalue.value.value
        })
    })

    itemToMonitor.nodeId = "ns=4;s=RFID2_Init.ReadValid_Port2"

    const monitor1 = (await subscription).monitor(itemToMonitor,parameters,opcua.TimestampsToReturn.Both)

    //if we use keepalive instead of changed I think the error which we were getting yesterday where it was only detecting
    //a change in value will be resolved 
    ;(await monitor1).on("changed", (datavalue) =>{
        console.log(datavalue.value.value)
        if(datavalue.value.value==true)
        {
            quality = 1;
        }
        io.sockets.emit("r1",{
            sensorData : datavalue.value.value
        })
    })

    itemToMonitor.nodeId = "ns=4;s=CNY.SEN4"

    const monitor2 = (await subscription).monitor(itemToMonitor,parameters,opcua.TimestampsToReturn.Both)

    //if we use keepalive instead of changed I think the error which we were getting yesterday where it was only detecting
    //a change in value will be resolved 
    ;(await monitor2).on("changed", (datavalue) =>{
        console.log(datavalue.value.value)
        if(quality==1)
        {
            console.log('OKAY')
        }
        else
        {
            console.log('REJECT')
        }
        if(datavalue.value.value==true)
        {
            quality = 0;
        }
        io.sockets.emit("s4",{
            sensorData : datavalue.value.value
        })
    })

}

// this is the main() function
// here we first check whether we connected to our machine or not
// then we create a session to establish a client-server connection
// after that we create a subscription to keep the connection continuous
// according to ChatGPT, a subscription allows us to receive notifications about real-time data changes
// in the subscription we check if the subscription is on then from which ID we are connected with
// keep alive is being displayed to let us know that the subscription is still active
// to monitor the item we have to describe it's node ID and use opcua.AttributeIds.value to give it an attributeId
// now the nodeId consist of a namespace address ns=4 and then name to the sensor of type string s=CNY.SEN1
// now we define some parameters which we need to monitor and create a monitor object
// we also create a socket to access the sensor data in our front-end
// for that we created a global socket in app.js from where we can access that socket anywhere in the project
// we emit the sensorData into the socket to access it in front-end?  
module.exports={main}