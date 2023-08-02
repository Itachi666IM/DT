const {
    OPCUAClient,
    AttributeIds,
    TimestampsToReturn,
    StatusCodes,
    DataType
} = require("node-opcua");

var integrate = {
    nodeId: "ns=4;s=GS1.Intergrate",
    attributeId: AttributeIds.Value,
    value: {
        statusCode: StatusCodes.Good,
        value: {
            dataType: DataType.Boolean,
            value: true
        }
    }
}

var start_true= {
    nodeId: "ns=4;s=GS1.HMI_Start",
    attributeId: AttributeIds.Value,
    value: {
        statusCode: StatusCodes.Good,
        value: {
            dataType: DataType.Boolean,
            value: true
        }
    }
}

var start_false= {
    nodeId: "ns=4;s=GS1.HMI_Start",
    attributeId: AttributeIds.Value,
    value: {
        statusCode: StatusCodes.Good,
        value: {
            dataType: DataType.Boolean,
            value: false
        }
    }
}

var stop_true= {
    nodeId: "ns=4;s=GS1.HMI_Stop",
    attributeId: AttributeIds.Value,
    value: {
        statusCode: StatusCodes.Good,
        value: {
            dataType: DataType.Boolean,
            value: true
        }
    }
}

var stop_false= {
    nodeId: "ns=4;s=GS1.HMI_Stop",
    attributeId: AttributeIds.Value,
    value: {
        statusCode: StatusCodes.Good,
        value: {
            dataType: DataType.Boolean,
            value: false
        }
    }
}

var reset_true= {
    nodeId: "ns=4;s=GS1.HMI_Reset",
    attributeId: AttributeIds.Value,
    value: {
        statusCode: StatusCodes.Good,
        value: {
            dataType: DataType.Boolean,
            value: true
        }
    }
}

var reset_false= {
    nodeId: "ns=4;s=GS1.HMI_Reset",
    attributeId: AttributeIds.Value,
    value: {
        statusCode: StatusCodes.Good,
        value: {
            dataType: DataType.Boolean,
            value: false
        }
    }
}

var order3= {
    nodeId: "ns=4;s=GS1.Order3",
    attributeId: AttributeIds.Value,
    value: {
        statusCode: StatusCodes.Good,
        value: {
            dataType: DataType.Boolean,
            value: true
        }
    }
}

var order1= {
    nodeId: "ns=4;s=GS1.Order1",
    attributeId: AttributeIds.Value,
    value: {
        statusCode: StatusCodes.Good,
        value: {
            dataType: DataType.Boolean,
            value: true
        }
    }
}

module.exports= {integrate, start_true, start_false, stop_true , stop_false, reset_true, reset_false, order3, order1}