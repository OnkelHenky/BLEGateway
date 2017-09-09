/**
 * Created by alex on 10.04.17.
 */


let Service = {};


class GenericService {

    constructor(name,values){
        this.name = name;
        this.handles= [];
        this.values = values
    }

    get name() {
        console.log('name = ' + this._name);

        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    add_characteristic_handle(uuid, handl){
        if (this.handles.indexOf(uuid) === -1) {
            this.handles[uuid] = handl;
            // console.log('==============================>',uuid);
        }else{
            console.log('Error, service with ID "'+uuid+'" already exits for '+this.name+ ' service');
        }

    }

    addCharacteristics(characteristics){
        for(let i in characteristics){
            this.add_characteristic_handle(characteristics[i].uuid, characteristics[i]);
        }

    }

    enableService(){
        if(this.service_needs_to_be_switched_on) {
            this.handles[this.config_uuid].write(Buffer.from(['0x01']), false, function (error) {
                if (!error) {
                    console.log('Enabled  ' + this.name);

                } else {
                    console.log('Error');
                }
            }.bind(this));
        }
    }


    subscribe(){
        this.handles[this.data_uuid].subscribe((error) => {
            console.log('Subscribed to ' + this.name);
            if(error){
                console.log('ERRROR ',error);
            }
        });
    }

    convertData(data){

    }

    read(data, isNotification){

    }
}

/**
 *
 */
class Battery extends GenericService{

    constructor(name,values){
        super(name,values);
        this.service_uuid = '180f',
        this.config_uuid = null,
        this.data_uuid = '2a19',
        this.period_uuid = null;
        this.service_needs_to_be_switched_on = false;

    }


    convertData(data){
        return data.readUInt8(0);
    }

    read(data, isNotification){
       data = this.convertData(data);
       console.log('battery level is now: ', data + '%');
       this.values[this._name] = data
    }


}

/**
 *
 */
class Temperature extends GenericService{

    constructor(name,values){
        super(name,values);
        this.service_uuid = 'f000aa0004514000b000000000000000',
        this.config_uuid = 'f000aa0204514000b000000000000000',
        this.data_uuid = 'f000aa0104514000b000000000000000',
        this.period_uuid = null;
        this.service_needs_to_be_switched_on = true;

    }

    convertData(data){
        let ambientTemperature = data.readInt16LE(2) / 128.0;
        let objectTemperature = data.readInt16LE(0) / 128.0;
        return [ambientTemperature, objectTemperature]
    }

    read(data, isNotification){
        if(isNotification){
            console.log('Notification received')
        }
        let [ambientTemperature, objectTemperature] = this.convertData(data);
        console.log('ambientTemperature = '+ ambientTemperature + '  objectTemperature = ' +objectTemperature);
        this.values[this._name] = 'ambientTemperature = '+ ambientTemperature + '  objectTemperature = ' +objectTemperature
    }

}

/**
 *
 */
class Luxometer extends GenericService{

    constructor(name,values){
        super(name,values);
        this.service_uuid = 'f000aa7004514000b000000000000000',
        this.config_uuid = 'f000aa7204514000b000000000000000',
        this.data_uuid = 'f000aa7104514000b000000000000000',
        this.period_uuid = 'f000aa7304514000b000000000000000';
        this.service_needs_to_be_switched_on = true;
    }

    convertData(data){
        let rawData = data.readUInt16LE(0);
        let exponent = (rawData & 0xF000) >> 12;
        let mantissa = (rawData & 0x0FFF);
        return mantissa * Math.pow(2, exponent) / 100.0;
    }

    read(data, isNotification){
        if(isNotification){
            //console.log('Notification received')
        }
        let convertedLuxValua = this.convertData(data);
        console.log('Lux value : '+ convertedLuxValua);
        this.values[this._name] = convertedLuxValua;
    }

}

Service.Battery = Battery;
Service.Temperature = Temperature;
Service.Luxometer = Luxometer;

module.exports.services = Service;