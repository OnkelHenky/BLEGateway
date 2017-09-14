const BLEInterface = require('../ble_interface');
const Service = require('../services/service').services;
const async = require('async');
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


    enableServices(peripheral){
        let self = this;
        console.log('TI SERVICE');

        peripheral.discoverServices(this.getServiceUUIDs(), function(error, services) {
            let serviceIndex = 0;
        //    console.log('Discovered the following services ',services);
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
                        console.log('Discovered the following characteristics ',characteristics.length);
                        //console.log('Discovered the following characteristics ',characteristics);

                        currentService.addCharacteristics(characteristics)
                                    .then(currentService.enableService)
                                    .then(currentService.subscribe)
                                    .then((currentService)=>{
                                        let dataHandle = currentService.handles[currentService.data_uuid];
                                        dataHandle.on('read', currentService.read.bind(currentService));
                                        dataHandle.read(()=> {});
                                        if(error){console.log('Error :',error);}
                                        serviceIndex++;
                                        callback();
                                    }).catch((error)=>{
                                    console.log('Error',error)})

                         });
                },
                function (err) {
                    if(err)console.log('Error',err);
                    console.log('================> All set up, waiting for stuff to happen <================');
                    //peripheral.disconnect();
                }
            );

        }.bind(this));
    }

}

module.exports = TISensortag;