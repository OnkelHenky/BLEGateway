const express = require('express');
const gateway =  require('./gateway');

const TIInterface = require('./device/ti_sensortag');
const app = express();

var values ={};

app.get('/', function (req, res) {
    console.log('REQUEST ======================>');
    let values = JSON.stringify(values);
    res.send(myJsonString)

});

app.listen(3030, function () {
    console.log('BLE Gateway Server running on port 3030');
    let BLE_Gateway = new gateway();
    BLE_Gateway.BLE_interface = new TIInterface("24:71:89:BC:1D:01",values); // SensorTag
    BLE_Gateway.powerOn();
});