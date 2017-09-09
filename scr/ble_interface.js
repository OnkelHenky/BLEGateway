/**
 * Created by alex on 10.04.17.
 */

"use strict";
const aux = require('./aux/auxilium');

/**
 * Class to cover all functions to connect to a BLE device.
 */
class BLEInterface {

    /**
     * The constructor
     * @param address, the physical address of the BLE device.
     */
    constructor (address){
        this.address = address;
        this.services = [];
        this._peripheral = void 0;
    }

    /**
     *
     * @returns {*}
     */
    get peripheral() {
        return this._peripheral;
    }

    /**
     *
     * @param value
     */
    set peripheral(value) {
        this._peripheral = value;
        this.peripheral.connect();
    }


    get ble_lib() {
        return this._ble_lib;
    }

    set ble_lib(value) {
        this._ble_lib = value;
    }

    /**
     * Enable the connection and establish the communication to the device
     */
    enableBLECommunication(){

        //  Scan
        this.ble_lib.on('stateChange', (state) => {
            if (state === 'poweredOn') {
                let serviceUUIDs = []; // default: [] => all
                this._ble_lib.startScanning(serviceUUIDs);
                console.log('Start Scanning');
            } else {
                this._ble_lib.stopScanning(serviceUUIDs);
            }
        });


        // Discover
        this.ble_lib.on('discover', (peripheral) => {
            if (peripheral.address.toUpperCase() === this.address.toUpperCase()) {
                console.log('Target device found, establish connection');
                this._ble_lib.stopScanning();
                this.peripheral = peripheral;
                // Connect
            this.peripheral.on('connect', () => {
                    console.log('Connected to: ' + this.peripheral.advertisement.localName);
                    this.enableServices(this.peripheral);
                });
            }


        });
    }

    /**
     *
     * @param peripheral
     */
    enableServices(peripheral){

    }

    /**
     * Add e service for this BLE Device
     * @param service_id, the UUID of the GenericService
     * @param service, the GenericService object.
     */
    addService(service_id, service){
        //Test if a service for the given ID was already registered.
        if (this.services.indexOf(service_id) === -1) {
            this.services[service_id] = service;
        }else{
            throw new aux.BLE_Exception('Error, service with ID "'+service_id+'" already exits.');
        }
    }

    /**
     * Get a array with all UUIDS, registered to a BLE device
     * @returns {Array}
     */
    getServiceUUIDs(){
        let _allUUIDS =[];
        for (var i in this.services){
            _allUUIDS.push(this.services[i].service_uuid)
        }
        return _allUUIDS
    }

    /**
     * Removing an service form the given BlE device.
     * @param service_id, the ID if the service that should be removed.
     */
    removeService(service_id){
        //Test if a service for the given ID was already registered.
        if (this.services.indexOf(service_id) === -1) {
            this.services = this.services.splice(0, this.services.indexOf(service_id));
        }else{
            throw new aux.BLE_Exception('Error, can not remove service. No service with ID: "'+service_id +'" found!');
        }
    }
}

module.exports = BLEInterface;