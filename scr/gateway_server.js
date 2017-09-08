const express = require('express');
const app = express();


const gateway =  require('./gateway');
const device =   require('./device/device');


app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
    var BLE_Gateway = new gateway();
    BLE_Gateway.device = new device("24:71:89:BC:1D:01"); // SensorTag
    //BLE_Gateway.device = new device("cc:20:e8:2a:5b:a0"); //iPhone 6S
    BLE_Gateway.powerOn();
});