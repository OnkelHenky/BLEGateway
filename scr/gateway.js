/**
 * Created by alex on 10.04.17.
 */

"use strict";
const _noble = require('noble');

class BLEGateway {

    constructor(ble_lib,ble_interface){
        this._BLE_interface = void 0;
        if(ble_lib){
            this.ble_lib= ble_lib;
        } else {
            this.ble_lib = _noble;// require('noble'); //Default;
        }if(ble_interface){
            this.BLE_interface = ble_interface
        }
    }

    get BLE_interface() {
        return this._BLE_interface;
    }

    set BLE_interface(value) {
        this._BLE_interface = value;
        this._BLE_interface.ble_lib = this.ble_lib;
        this.BLE_interface.enableBLECommunication();

    }


    set device(ble_device){
        if(ble_device){

        }
    }

    powerOn(){
     this.ble_lib.state = 'poweredOn';//Switching on the gateway.
    }

    powerOff(){
        this.ble_lib.state = 'poweredOff';//Switching on the gateway.
    }

}

module.exports = BLEGateway;