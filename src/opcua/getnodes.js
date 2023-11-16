const opcua = require("node-opcua");
const fs = require("fs");

const NodeClass = opcua.NodeClass;
//to obtain the nodeClass from the opcua we have to declare this const variable
//if we don't do this then the nodeClass will not be returned as a string even if we use tostring()
//This happens because reference.nodeClass returns the reference/level of the recursion instead
//opcua.nodeClass will return the desired string ans we are making a map NodeClass to store the strings

const connectionStrategy =  {
  initialDelay : 0,
  maxRetry : 2,
  maxDelay : 10*1000
};

const options1 = {
  connectionStrategy: connectionStrategy,
  endpointMustExist: false,
};
// to set up a client we have to define another object where one of the key will take connectionStraegy as value

const client = opcua.OPCUAClient.create(options1)
// now we make a client object using opcua funtion opcua.OPCUAClient.create

// const client = OPCUAClient.create(options)

const endpoint = 'opc.tcp://'
// this statement connects us to the promoteToStateMachine, here we are connecting through IP address

const NodeArray = []; 

async function sendNodeData(nodename,nodeId){
  const nodeInfo = {
    name: nodename,
    nodeId: nodeId,
  };
  NodeArray.push(nodeInfo);
}

async function browseAndCollectAllNodes(session, currentNodeId, nodePath, nodeInfoArray) {
  try {
    const browseResult = await session.browse(currentNodeId);
  
    for (const reference of browseResult.references) {
      try {
        const childNodePath = nodePath + "/" + reference.browseName.toString();
  
        const nodeClass = NodeClass[reference.nodeClass];
  
        const node = {
          nodeName: reference.browseName.toString(),
          nodeType: reference.nodeClass.toString(),
          nodeId: reference.nodeId.toString(),
          nodePath: childNodePath,
          nodeClass: nodeClass
        };
  
        nodeInfoArray.push(node);
  
        if (reference.nodeClass === NodeClass.Object) {
          await browseAndCollectAllNodes(session, reference.nodeId, childNodePath, nodeInfoArray);
        }
      } catch (err) {
        console.error(`Error for node ${reference.nodeId.toString()}:`, err.message);
      }
    }
  
    return nodeInfoArray;
  } catch (err) {
    console.error(`Error for node ${currentNodeId}:`, err.message);
    return nodeInfoArray;
  }
  
}
//This is the key function in this code
//Here we are getting all the nodes by first entering the RootFolder of the device
//Then we are recursively going through all the sub-folders to check for further nodes
//Once we find any sub-sub folder, then we can call the function again and in the end return the array
//If we don't return the array then at the end of 1 cycle the function returns just the sub-folders within the RootFolder
//We return the array even if we catch an error, this way we can keep track of the error

async function main(machine_ip){
  let complete_ip = endpoint + machine_ip;
  
  client.on('backoff',()=>{
      console.log('retrying connection')
  })
  
  await client.connect(complete_ip)

  console.log('Connected to PLC');

  const session = await client.createSession();

  // Inside the try block, after connecting to the server

  try {
    const startingNodeId = "ns=0;i=84"; // Replace with the appropriate starting node
    const startingNodePath = "RootFolder"; // Replace with the appropriate starting path

    const nodeInfoArray = await browseAndCollectAllNodes(session, startingNodeId, startingNodePath,[]);

    const requiredArray = [];

    let nodeInfoText = "";
    for (const node of nodeInfoArray) {
      nodeInfoText += `Node Path: ${node.nodePath}\n`;
      nodeInfoText += `Node Name: ${node.nodeName}\n`;
      nodeInfoText += `Node Type: ${node.nodeType}\n`;
      nodeInfoText += `Node ID: ${node.nodeId}\n`;
      nodeInfoText += `Node Class: ${node.nodeClass}\n\n`;
      if(node.nodeClass==="Variable")
      {
        requiredArray.push(node.nodeName);
        await sendNodeData(node.nodeName,node.nodeId);
      }
    }

    // Write the JSON data to a text file
    fs.writeFileSync("nodes.txt", nodeInfoText);

    console.log("Node information saved to nodes.txt");

    io.on('connection',(socket)=>{
      console.log('Connected to sockets');
      socket.emit("Node Names",requiredArray);
    })


    console.log(requiredArray[0],requiredArray[1],requiredArray[2]);

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await session.close();
    await client.disconnect();
  }

}
//This is the main function of the file
//Here we are first creating a session as we already know that we can connect to client because of connect.js
//In the try-catch block for now we are extracting all the nodes and storing it in an array at first
//Then we are storing it in a text file for us to see what are the nodes that we are obtaining
//Now I want to display all the nodes that are of nodeClass === "Variable" on the frontend 

module.exports={
  main:main,
  NodeArray:NodeArray,
};


