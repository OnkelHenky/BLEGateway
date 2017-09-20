const express = require('express');
const gateway =  require('./gateway');

const TIInterface = require('./device/ti_sensortag');
const Cooktop = require('./device/cooktop');
const app = express();

var values ={};
let GATEWAY = new gateway();

app.get('/', function (req, res) {
    console.log('REQUEST ======================>',values);
    let BLEvalues = JSON.stringify(values);
    GATEWAY.write();
    res.send(BLEvalues)
});

app.listen(3030, function () {
    console.log('BLE Gateway Server running on port 3030');
    console.log('SHH WORKs !!!');
    GATEWAY.BLE_interface = new TIInterface("24:71:89:BC:1D:01",values); // SensorTag
   // GATEWAY.BLE_interface = new Cooktop("38:B5:BD:45:67:89",values); // Cooktop
    GATEWAY.powerOn();


});




