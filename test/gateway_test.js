/**
 * Created by alex on 10.04.17.
 */

"use strict";

var gateway =  require('../scr/gateway');
var device =   require('../scr/device/device');

var BLE_Gateway = new gateway();
//BLE_Gateway.device = new device("24:71:89:BC:1D:01"); // SensorTag
BLE_Gateway.device = new device("cc:20:e8:2a:5b:a0"); //iPhone 6S
BLE_Gateway.powerOn();