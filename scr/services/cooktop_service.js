const GenericService = require('./service').GenericService;
let Service = {};


/**
 *
 */

class Vendor extends GenericService{

    constructor(name,values){
        super(name,values);
        this.service_uuid = '180a';
        this.config_uuid = '';
        this.data_uuid = '2a29';
        this.period_uuid = false;
        this.service_needs_to_be_switched_on = false;
    }

    convertData(data){
        return data;
    }

    read(data, isNotification){

        if(isNotification){
            console.log('Notification received')
        }
        let convertedData = this.convertData(data);
        console.log('Vendor  : '+ convertedData);
        this.values[this._name] = convertedData;
    }

}

/**
 *
 */
class CooktopStatus extends GenericService{

    constructor(name,values){
        super(name,values);
        this.service_uuid = '8520510026dd913f4b8fee97799e304f';    //85205100-26dd-913f-4b8f-ee97799e304f
        this.config_uuid =  '8520510126dd913f4b8fee97799e304f';    //85205101-26dd-913f-4b8f-ee97799e304f
        this.data_uuid =    '8520510226dd913f4b8fee97799e304f';    //85205102-26dd-913f-4b8f-ee97799e304f
        this.period_uuid = false;
        this.service_needs_to_be_switched_on = false;
    }

    convertData(data){
        console.log('data: ',data);
       // return data;
        if(data) {
            console.log('typeof: ', typeof data);
            let convertedData = data.readUInt32BE(0);
            console.log('convertedDate: ', convertedData);
            console.log('convertedDate: ', parseInt(convertedData, 10).toString(16));
            console.log('convertedDate: ', parseInt(convertedData, 10).toString(2));
            return convertedData

        }

        return data
    }

    read(data, isNotification){

        if(isNotification){
            console.log('Notification received')
        }
        let convertedData = this.convertData(data);
        console.log('Cooktop status : '+ convertedData);
        this.values[this._name] = convertedData;
    }

}

Service.CooktopStatus = CooktopStatus;
Service.Vendor = Vendor;

module.exports.services = Service;