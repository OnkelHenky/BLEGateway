const BLEInterface = require('../ble_interface');
const Service = require('../services/service').services;
/**
 * Class to cover all functions to connect to a BLE device.
 */
class TISensortag extends BLEInterface{

    constructor (address,values){
        super(address);
        this.addService('180f', new Service.Battery('Battery',values));
        this.addService('f000aa0004514000b000000000000000', new Service.Temperature('Temperature',values));
        this.addService('f000aa7004514000b000000000000000', new Service.Luxometer('Luxometer',values));
    }


    /**
     *
     * @param peripheral
     */
    enableServices(peripheral){
        peripheral.discoverServices(this.getServiceUUIDs(), function(error, serv) {

            console.log('Discovered the following services ');
            for (var x in serv) {
                console.log('  ' + x + ' uuid: ' + serv[x].uuid);

            let currentService = this.services[serv[x].uuid];
            currentService.add_characteristic_handle(currentService.service_uuid, serv[x]);

                serv[x].discoverCharacteristics(null, function(error, characteristics) {
                    console.log('Discovered the following characteristics ');
                    for (var x in characteristics) {
                        console.log('  ' + x + ' uuid: ' + characteristics[x].uuid);
                    }

                    currentService.addCharacteristics(characteristics);
                    currentService.enableService();
                    currentService.subscribe();

                   let characteristicHandle = characteristics[0];

                   characteristicHandle.read(()=> {});
                   characteristicHandle.on('read', currentService.read.bind(currentService));

                });
            }
            }.bind(this));
    }
}

module.exports = TISensortag;