const BLEInterface = require('../ble_interface');
const CooktopService = require('../services/cooktop_service').services;
const async = require('async');
/**
 * Class to cover all functions to connect to a BLE device.
 */
class Cooktop extends BLEInterface{

    constructor (address,values){
        super(address);
        this.addService('180a', new CooktopService.Vendor('Vendor',values));
        this.addService('8520510026dd913f4b8fee97799e304f', new CooktopService.CooktopStatus('CooktopStatus',values));
    }

    /**
     *
     * @param peripheral
     */
    enableServices(peripheral){
        let self = this;
        peripheral.discoverServices(this.getServiceUUIDs(), function(error, services) {
            let serviceIndex = 0;
            console.log('Discovered the following services ');
            async.whilst(
                function () {
                    //console.log('services.length :',serviceIndex);
                    return (serviceIndex < services.length);
                },
                function(callback) {
                    let service = services[serviceIndex];
                    let serviceInfo = service.uuid;

                    if (service.name) {
                        serviceInfo += ' (' + service.name + ')';
                    }
                    console.log(serviceInfo);

                    let currentService = self.services[service.uuid];
                    currentService.add_characteristic_handle(serviceInfo, service);

                    service.discoverCharacteristics(null, function(error, characteristics) {
                        let characteristicIndex = 0;
                        console.log('Discovered the following characteristics ');
                        async.whilst(
                            function () {
                               // console.log('characteristicIndex ============> :',characteristicIndex);
                                return (characteristicIndex < characteristics.length);
                            },
                            function(callback) {
                                let characteristic = characteristics[characteristicIndex];
                                let characteristicInfo = '  ' + characteristic.uuid;

                                if (characteristic.name) {
                                    characteristicInfo += ' (' + characteristic.name + ')';
                                }
                               // console.log(characteristicInfo);

                                currentService.add_characteristic_handle(characteristic.uuid, characteristic)
                                    .then(currentService.enableService)
                                    .then(() =>{
                                        characteristicIndex++;
                                        callback();
                                    }).catch((error)=>{
                                    console.log('Error',error);
                                })

                            },
                            function(error) {
                                currentService.subscribe(currentService)
                                .then(()=>{
                                    let characteristicHandle = characteristics[1];
                                    characteristicHandle.on('read', currentService.read.bind(currentService));
                                    characteristicHandle.read(()=> {});
                                    if(error){console.log('Error :',error);}
                                    serviceIndex++;
                                    callback();
                                }).catch((error)=>{
                                    console.log('Error', error);
                                });
                            }
                        );
                    });
                },
                function (err) {
                    if(err)console.log('Error',err);
                    console.log('================> All set up, waiting for stuff to happen <================');
                    //   peripheral.disconnect();
                }
            );

        }.bind(this));
    }


}

module.exports = Cooktop;