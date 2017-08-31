/**
 * Created by alex on 10.04.17.
 */

var auxilium = {};


/**
 * A custom exception fot the usage in the BLE gateway
 */
auxilium.BLE_Exception =  BLE_Exception = function(msg) {

    this._type_  = "BLE_Exception";
    this.name = "BLE_Exception";
    this.message = "BLE_Exception";

    if(msg){
        this.message = msg;
    }

};


module.exports.auxilium;