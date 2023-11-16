const getnodes = require("./getnodes");
const opcua = require("node-opcua");

let Tree = [];
let d = 0;
let c = 0;
let g = 0;
async function main(machine_ip,final_tree)
{
    const p = 'opc.tcp://';
    const endpoint = p + machine_ip;
    let NodeArray = getnodes.NodeArray;
    const connectionStrategy = {
        initialDelay: 0,
        maxRetry: 2,
        maxDelay: 10*1000
    };
    // to set up a connection we have to define connectionStrategy object

    const options1 = {
        connectionStrategy: connectionStrategy,
        endpointMustExist: false,
    };
    // to set up a client we have to define another object where one of the key will take connectionStraegy as value

    const client = opcua.OPCUAClient.create(options1);
    // now we make a client object using opcua funtion opcua.OPCUAClient.create

    io.on('connection',(socket)=>{
        console.log('connected to sockets');
    })
    
    client.on('backoff',()=>{
        console.log('retrying connection');
    })
    
    await client.connect(endpoint);

    console.log('Connected to PLC');

    const session = client.createSession();

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
    
    for(node of final_tree)
    {
        const componentName = node.name;
        const nodeName = node.componentNode;
        const nodeIdFind = NodeArray.find(obj => obj.name === nodeName);
        const nodeId = nodeIdFind.nodeId;
        const obj = {
            name: componentName,
            nodename: nodeName,
            nodeid: nodeId,
        };

        Tree.push(obj);

        const itemToMonitor = {
            nodeId: nodeId,
            attributeId: opcua.AttributeIds.Value
        };

        const parameters = {
            samplingInterval: 1,
            discardOldest: true,
            queueSize: 10
        };

        const monitor = (await subscription).monitor(itemToMonitor,parameters,opcua.TimestampsToReturn.Both)

        ;(await monitor).on("changed", (datavalue) =>{
            console.log(datavalue.value.value)
            io.sockets.emit(nodeId,{
                sensorData : datavalue.value.value
            })
        })
        
    }
    const itemToMonitor2 = {
        nodeId: "ns=4;s=CNY.SEN4",
        attributeId: opcua.AttributeIds.Value
    };

    const parameters2 = {
        samplingInterval: 1,
        discardOldest: true,
        queueSize: 10
    };

    const monitor2 = (await subscription).monitor(itemToMonitor2,parameters2,opcua.TimestampsToReturn.Both)

    ;(await monitor2).on("changed", (datavalue) =>{
        if(datavalue.value.value==true){
            c++;
        if(d%4==0 && d!=0)
        {
            d = d + Math.floor(Math.random()*20);
        }
        else
        {
            d=d+1;
        }
    }
    })
    const itemToMonitor3 = {
        nodeId: "ns=4;s=RFID2_Init.ReadValid_Port2",
        attributeId: opcua.AttributeIds.Value
    };

    const parameters3 = {
        samplingInterval: 1,
        discardOldest: true,
        queueSize: 10
    };

    const monitor3 = (await subscription).monitor(itemToMonitor3,parameters3,opcua.TimestampsToReturn.Both)

    ;(await monitor3).on("changed", (datavalue) =>{
        if(datavalue.value.value==true){
        g++;
    }
    })
}

module.exports = {
    main:main,
    Tree:Tree,
    downtime:()=>d,
    numberOfJobs:()=>c,
    goodJobs:()=>g,
};
  