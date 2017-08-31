/**
 * Created by alex on 10.04.17.
 */

var _device = require('../scr/device/device');


class my_device {

    constructor(address){
        this.address = address

    }

    batteryStatus(){

    }

}


/*

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
 });
 });
 });

 */