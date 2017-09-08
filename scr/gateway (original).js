/**
 * Created by alex on 10.04.17.
 */

"use strict";
const _noble = require('noble');


var app = {};

app.sensortag = {};

// UUIDs for movement services and characteristics.
app.sensortag.MOVEMENT_SERVICE = 'f000aa80-0451-4000-b000-000000000000';
app.sensortag.MOVEMENT_DATA = 'f000aa81-0451-4000-b000-000000000000';
app.sensortag.MOVEMENT_CONFIG = 'f000aa82-0451-4000-b000-000000000000';
app.sensortag.MOVEMENT_PERIOD = 'f000aa83-0451-4000-b000-000000000000';
app.sensortag.MOVEMENT_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb';


app.sensortag.IO_SERVICE = 'f000aa64-0451-4000-b000-000000000000';
app.sensortag.IO_CONFIG = 'f000aa66-0451-4000-b000-000000000000';
app.sensortag.IO_DATA = 'f000aa65-0451-4000-b000-000000000000';

app.sensortag.BAROMETER_SERVICE = 'f000aa40-0451-4000-b000-000000000000';
app.sensortag.BAROMETER_DATA = 'f000aa41-0451-4000-b000-000000000000';
app.sensortag.BAROMETER_CONFIG = 'f000aa42-0451-4000-b000-000000000000';
app.sensortag.BAROMETER_CALIBRATION = 'f000aa43-0451-4000-b000-000000000000';
app.sensortag.BAROMETER_PERIOD = 'f000aa44-0451-4000-b000-000000000000';
app.sensortag.BAROMETER_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb';


app.sensortag.LUX_SERVICE = 'f000aa7004514000b000000000000000';
app.sensortag.LUX_SERVICE_DATA = 'f000aa7104514000b000000000000000';


app.sensortag.TEMP_SERVICE = 'f000aa0004514000b000000000000000';
app.sensortag.TEMP_SERVICE_DATA = 'f000aa0104514000b000000000000000';


app.buzzerFail = function() {
    console.log("Buzzer failed: ");
}


//var  buntfalke_address = "cc:20:e8:2a:5b:a0";

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
                let serviceUUIDs = []; // default: [] => all
                this.ble_lib.startScanning(serviceUUIDs);
                console.log('Start Scanning');
            } else {
                this.ble_lib.stopScanning(serviceUUIDs);
            }
        });

        this.ble_lib.on('discover', (peripheral) => {
           // console.log('discovered -> ' + peripheral.address  + ' name:' + peripheral.advertisement.localName);
           // console.log('this.ble_device.address -> ' + this.ble_device.address);
            if (peripheral.address.toUpperCase() === this.ble_device.address.toUpperCase()) {
                console.log('Target device found, establish connection');
                this.ble_lib.stopScanning();
                peripheral.connect();

            }

            peripheral.on('connect', () => {
                console.log('Connected to: ' +peripheral.advertisement.localName);
                console.log('Discover services');


   /*  peripheral.discoverServices(['180f'], function(error, services) {
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
                // peripheral.disconnect();
             });
         });
     }); */

                peripheral.discoverServices([app.sensortag.TEMP_SERVICE], function(error, services) {
                    console.log('discovered the following services:');
                    for (var i in services) {
                        console.log('  ' + i + ' uuid: ' + services[i].uuid);
                    }

                    services[0].discoverCharacteristics(false, function (error, characteristics) {
                        for (var x in characteristics) {
                            console.log('  ' + x + ' uuid: ' + characteristics[x]);
                        }

                        characteristics[1].write(Buffer.from(['0x01']), false, function (error) {
                            if (!error) {
                                console.log('Erfolg');

                            } else {
                                console.log('Error');

                            }
                        }.bind(this));

                        var tempChar = characteristics[0];
                        console.log('discovered manufacturer '+tempChar);
                      //  console.log('discovered manufacturer name characteristic');
                        tempChar.read(function () {

                        });
                        //console.log(data);

                        tempChar.on('read', function(data, isNotification) {

                            console.log('data: ', data);
                            console.log('data.length: ', data.length);
                            console.log('JSON.stringify(bufffer) ', JSON.stringify(data));

                            var ambientTemperature = data.readInt16LE(2) / 128.0;
                            var objectTemperature = data.readInt16LE(0) / 128.0;

                            console.log('ambientTemperature = '+ ambientTemperature + '  objectTemperature = ' +objectTemperature);


                        });

                        tempChar.subscribe(function(error) {
                            console.log('battery level notification on');
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


