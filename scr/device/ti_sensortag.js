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

}

module.exports = TISensortag;