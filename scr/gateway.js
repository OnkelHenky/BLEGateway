/**
 * Created by alex on 10.04.17.
 */

"use strict";
var _noble = require('noble');


var  buntfalke_address = "cc:20:e8:2a:5b:a0";

class BLEGateway {

    constructor(ble_lib){
        if(ble_lib){
            this.ble_lib= ble_lib;
        } else {
            this.ble_lib = _noble;// require('noble'); //Default;
        }
        //this.enableBLECommunication();
    }

    set device(ble_device){
        if(ble_device){
            this.ble_device = ble_device;
            this.enableBLECommunication();
        }
    }

    enableBLECommunication(){
        this.ble_lib.on('stateChange', (state) => {
            if (state === 'poweredOn') {
                // serviceUUIDs = ["180f"]; // default: [] => all
                var serviceUUIDs = []; // default: [] => all
                // // var serviceUUIDs = []; // default: [] => all
                this.ble_lib.startScanning(serviceUUIDs);
            } else {
                this.ble_lib.stopScanning(serviceUUIDs);
            }
        });

        this.ble_lib.on('discover', (peripheral) => {
            console.log('discovered -> ' + peripheral.address  + ' name:' + peripheral.advertisement.localName);
            console.log('this.ble_device.address -> ' + this.ble_device.address);
            if (peripheral.address.toUpperCase() === this.ble_device.address.toUpperCase()) {
                console.log('target device found, establish connection');
                this.ble_lib.stopScanning();
                peripheral.connect();

            }

            peripheral.on('connect', () => {
                console.log('on -> connect, to ' +peripheral.advertisement.localName);
                peripheral.discoverServices(['180f'], function(error, services) {
                    var deviceInformationService = services[0];
                    console.log('discovered device information service');

                    deviceInformationService.discoverCharacteristics(['2a19'], function(error, characteristics) {
                        var batteryLevelCharacteristic = characteristics[0];
                        console.log('discovered manufacturer '+characteristics);
                        console.log('discovered manufacturer name characteristic');
                        batteryLevelCharacteristic.read(function () {

                        });
                        batteryLevelCharacteristic.on('read', function(data, isNotification) {
                            console.log('battery level is now: ', data.readUInt8(0) + '%');
                            peripheral.disconnect();
                        });
                    });
                });

            });

            peripheral.on('disconnect', ()  => {
                console.log('on -> disconnect, bye bye');
                peripheral.disconnect();
                process.exit();
            });


        });

    }

    powerOn(){
     this.ble_lib.state = 'poweredOn';//Switching on the gateway.
    }

    powerOff(){
        this.ble_lib.state = 'poweredOff';//Switching on the gateway.
    }



}


module.exports = BLEGateway;


