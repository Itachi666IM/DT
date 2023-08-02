// const {main} = require('./opcua/connect')

const {integrate, start_true, start_false, stop_true , stop_false, reset_true, reset_false, order3, order1} = require('./opcua/control');

var count = 0
var status
var start
let f_count = 0

io.on('connect',()=>{
    console.log('socket-opcua')
})

plcClient.then(client=>{
    try {
        (async()=>{
            //session create
            const session = await client.createSession();
            const subscription = await session.createSubscription2({
                requestedPublishingInterval: 1000,
                requestedLifetimeCount: 100, 
                requestedMaxKeepAliveCount: 10,
                maxNotificationsPerPublish: 10,
                publishingEnabled: true,
                priority: 10
            });

            //subscription
            subscription
                .on("started", () => console.log("subscription started - subscriptionId=", subscription.subscriptionId))
                .on("keepalive", () => console.log("keepalive"))
                .on("terminated", () => console.log("subscription terminated"));
    
                const itemToMonitor = {
                    nodeId: "ns=4;s=CNY.SEN1",
                    attributeId: AttributeIds.Value
                };
    
                const parameters = {
                    samplingInterval: 1,
                    discardOldest: true,
                    queueSize: 10
                };

                // //photosensor 1
                // const monitoredItem = await subscription.monitor(itemToMonitor, parameters, TimestampsToReturn.Both)
                // monitoredItem.on("changed", (dataValue) =>{
                //     io.sockets.emit("sen1",{
                //         sensorData: dataValue.value.value
                //     })
                //     // console.log('end')
                // })
    
                // //photosensor 2
                // itemToMonitor.nodeId="ns=4;s=CNY.SEN2";
                // const monitoredItem2 = await subscription.monitor(itemToMonitor, parameters, TimestampsToReturn.Both)
                // monitoredItem2.on("changed", (dataValue) => {
                //     if(dataValue.value.value==true){
                //         status=false
                //         io.sockets.emit("jobquality",{
                //             sensorData: count
                //         })
                //         io.sockets.emit("failure",{
                //             sensorData: f_count
                //         })
                //         if(count==1){
                //             ok(start,f_count)
                //             count=0
                //             f_count=0
                //         }else{
                //             reject(start,f_count)
                //             count=0
                //             f_count=0
                //         }
                //     }
                //     io.sockets.emit("sen2",{
                //         sensorData: dataValue.value.value
                //     })
                // })

                // //photosensor 3
                // itemToMonitor.nodeId="ns=4;s=CNY.SEN3";
                // const monitoredItem3 = await subscription.monitor(itemToMonitor, parameters, TimestampsToReturn.Both)
                // monitoredItem3.on("changed", (dataValue) => {
                //     io.sockets.emit("sen3",{
                //         sensorData: dataValue.value.value
                //     })
                // })

                // //photosensor 4
                // itemToMonitor.nodeId="ns=4;s=CNY.SEN4";
                // const monitoredItem4 = await subscription.monitor(itemToMonitor, parameters, TimestampsToReturn.Both)
                // monitoredItem4.on("changed", async(dataValue) => {
                //     io.sockets.emit("sen4",{
                //         sensorData: dataValue.value.value
                //     })
                // })

                // //pneumatic arm
                // itemToMonitor.nodeId="ns=4;s=PP.VaccumOn";
                // const monitoredItem5 = await subscription.monitor(itemToMonitor, parameters, TimestampsToReturn.Both)
                // monitoredItem5.on("changed", (dataValue) => {
                //     io.sockets.emit("arm",{
                //         sensorData: dataValue.value.value
                //     })
                // })

                // //machining setup-cover
                // itemToMonitor.nodeId="ns=4;s=VM.CoverDownSen";
                // const monitoredItem6 = await subscription.monitor(itemToMonitor, parameters, TimestampsToReturn.Both)
                // monitoredItem6.on("changed", (dataValue) => {
                //     io.sockets.emit("cover",{
                //         sensorData: dataValue.value.value
                //     })
                // })

                // //pressure consumption
                // itemToMonitor.nodeId="ns=4;s=Pneu_Energy.Pressure_Bar";
                // const monitoredItem7 = await subscription.monitor(itemToMonitor, parameters, TimestampsToReturn.Both)
                // monitoredItem7.on("changed", (dataValue) => {
                //     // console.log(dataValue)
                //     io.sockets.emit("pressure",{
                //         sensorData: dataValue.value.value
                //     })
                // })

                // //feeder
                // itemToMonitor.nodeId="ns=4;s=TT.TP2RevSen";
                // const monitoredItem8 = await subscription.monitor(itemToMonitor, parameters, TimestampsToReturn.Both)
                // monitoredItem8.on("changed", (dataValue) => {
                //     io.sockets.emit("feeder",{
                //         sensorData: dataValue.value.value
                //     })
                // })
                
                // //rfid2
                // itemToMonitor.nodeId="ns=4;s=RFID1_Init.ReadValid";
                // const monitoredItem9 = await subscription.monitor(itemToMonitor, parameters, TimestampsToReturn.Both)
                // monitoredItem9.on("changed", (dataValue) => {
                //     if(status=true){
                //         if(dataValue.value.value==true){
                //             count=1
                //         }
                //     }
                // })

                // //spindle
                // itemToMonitor.nodeId="ns=4;s=VM.Spindle_ON";
                // const monitoredItem10 = await subscription.monitor(itemToMonitor, parameters, TimestampsToReturn.Both)
                // monitoredItem10.on("changed", (dataValue) => {
                //     io.sockets.emit("spindle",{
                //         sensorData: dataValue.value.value
                //     })
                // })

                // //clamp-electrical actuator
                // itemToMonitor.nodeId="ns=4;s=GS1.Lec_Response";
                // const monitoredItem11 = await subscription.monitor(itemToMonitor, parameters, TimestampsToReturn.Both)
                // monitoredItem11.on("changed", (dataValue) => {
                //     var reading = parseInt(dataValue.value.value);
                //     io.sockets.emit("clamp",{
                //         sensorData: reading
                //     })
                // })
                
                // //inventory-optical sensor
                // itemToMonitor.nodeId="ns=4;s=MAG1.MagPrevSen";
                // const monitoredItem12 = await subscription.monitor(itemToMonitor, parameters, TimestampsToReturn.Both)
                // monitoredItem12.on("changed", (dataValue) => {
                //     io.sockets.emit("warninventory",{
                //         sensorData: dataValue.value.value
                //     })
                // })

                // itemToMonitor.nodeId="ns=4;s=MAG1.MagPusherRev";
                // const monitoredItem13 = await subscription.monitor(itemToMonitor, parameters, TimestampsToReturn.Both)
                // monitoredItem13.on("changed", (dataValue) => {
                //     io.sockets.emit("pusher",{
                //         sensorData: dataValue.value.value
                //     })
                // })

                //start command accept
                
                io.on('connect', socket => {
                    console.log("Connected to Sockets")
                    socket.on('start', async(data) => {
                        console.log('start')
                        start = new Date().getTime();
                        var sessiondata = await session
                        const x = await session.write(integrate);
                        // var markov = await fetch()
                        // console.log(markov)
                        new_data()
                        var failure = await fetch()
                        if(failure==1){
                            f_count=1
                            console.log(failure)
                            const y = await session.write(order3);
                        }else{
                            f_count=0
                            console.log(failure)
                            const y = await session.write(order1)
                        }
                        const statusCode = await sessiondata.write(start_true);
                        const statusCode_false = await sessiondata.write(start_false);
                    });
                });

                //stop command accept
                io.on('connect', socket => {
                    socket.on('stop', async(data) => {
                        var sessiondata = await session
                        console.log('stop')
                        const statusCode = await sessiondata.write(stop_true);
                        const statusCode_false = await sessiondata.write(stop_false);
                    });
                });

                //reset command accept
                io.on('connect', socket => {
                    socket.on('reset', async(data) => {
                        var sessiondata = await session
                        console.log('reset')
                        const statusCode = await sessiondata.write(reset_true);
                        const statusCode_false = await sessiondata.write(reset_false);
                    });
                });

                //reset database
                io.on('connection', socket => {
                    socket.on('resetdatabase', async(data) => {
                        // del();
                    }); 
                });
        })()
    }

    catch (err) {
        console.log("Error !!!", err);
        process.exit();
    }
})

Router.get('/',(req,res)=>{
    res.render('test')
})

module.exports = Router