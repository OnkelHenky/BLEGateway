const BLEInterface = require('../ble_interface');
const Services = require('../services/service').services;
/**
 * Class to cover all functions to connect to a BLE device.
 */
class TISensortag extends BLEInterface{

    constructor (address){
        super(address);
        this.addService('180f', new Services.battery());
        this.addService('f000aa0004514000b000000000000000', new Services.temp());
        this.addService('f000aa7004514000b000000000000000', new Services.lux());
    }


    /**
     *
     * @param peripheral
     */
    enableServices(peripheral){
        let test =[];
        for (var i in this.services){
            test.push(this.services[i].service_uuid)
        }
        console.log('test: ', test);

        //for (var i in this.services){
          //  console.log('Services ' + i +' ' + this.services[i] );


            peripheral.discoverServices(test, function(error, services) {
              //  var deviceInformationService = services[0];
               // console.log('this', this.);

                for (var x in services) {
                    console.log('currentService : ', services[x]);
                    let currentService = this.services[services[x].uuid];


                    console.log('  ' + x + ' uuid: ' + services[x].uuid);

                currentService.add_characteristic_handle(currentService.service_uuid, services[x]);
                console.log('discovered device information service');

                    services[x].discoverCharacteristics(null, function(error, characteristics) {
                  //console.log('currentService.data_uuid: ',characteristics);

                    for (var x in characteristics) {
                        console.log('  ' + x + ' uuid: ' + characteristics[x].uuid);
                    }

                    currentService.addCharacteristics(characteristics);
                    currentService.enableService();
                    currentService.subscribe();

                    var batteryLevelCharacteristic = characteristics[0];
                   // console.dir(batteryLevelCharacteristic);

                  //  currentService.add_characteristic_handle(currentService.data_uuid,batteryLevelCharacteristic);
                   // console.log('discovered manufacturer '+characteristics);
                    console.log('discovered manufacturer name characteristic');
                    batteryLevelCharacteristic.read(function () {

                    });
                    batteryLevelCharacteristic.on('read', currentService.read.bind(currentService));

                });
                }
            }.bind(this));
        //}
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
                    // peripheral.disconnect();
                });
            });
        }); */

    }

}

module.exports = TISensortag;