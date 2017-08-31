/**
 * Created by alex on 10.04.17.
 */

"use strict";

var aux = require('../aux/auxilium').auxilium;

/**
 * Class to cover all functions to connect to a BLE device.
 */
class BLEDevice {
    /**
     * The constructor
     * @param address, the physical address of the BLE device.
     */
    constructor (address){
        this.address = address;
        this.services = [];
    }

    /**
     * Add e service for this BLE Device
     * @param service_id, the UUID of the Service
     * @param service, the Service object.
     */
    addService(service_id, service){
        //Test if a service for the given ID was already registered.
        if (this.services.indexOf(service_id) !== -1) {
            this.services[service_id] = service;
        }else{
            throw new aux.BLE_Exception('Error, service with ID "'+service_id+'" already exits.');
        }
    }

    /**
     * Removing an service form the given BlE device.
     * @param service_id, the ID if the service that should be removed.
     */
    removeService(service_id){
        //Test if a service for the given ID was already registered.
        if (this.services.indexOf(service_id) !== -1) {
            this.services = this.services.splice(0, this.services.indexOf(service_id));
        }else{
            throw new aux.BLE_Exception('Error, service with ID "'+service_id+'" already exits.');
        }
    }
}

module.exports = BLEDevice;