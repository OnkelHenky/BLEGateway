/**
 * Created by alex on 10.04.17.
 */

var app = {};

app.sensortag = {};

// UUIDs for movement services and characteristics.
app.sensortag.MOVEMENT_SERVICE = 'f000aa80-0451-4000-b000-000000000000';
app.sensortag.MOVEMENT_DATA = 'f000aa81-0451-4000-b000-000000000000';
app.sensortag.MOVEMENT_CONFIG = 'f000aa82-0451-4000-b000-000000000000';
app.sensortag.MOVEMENT_PERIOD = 'f000aa83-0451-4000-b000-000000000000';
app.sensortag.MOVEMENT_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb';


app.sensortag.IO_SERVICE = 'f000aa64-0451-4000-b000-000000000000';
app.sensortag.IO_CONFIG = 'f000aa66-0451-4000-b000-000000000000';
app.sensortag.IO_DATA = 'f000aa65-0451-4000-b000-000000000000';

app.sensortag.BAROMETER_SERVICE = 'f000aa40-0451-4000-b000-000000000000';
app.sensortag.BAROMETER_DATA = 'f000aa41-0451-4000-b000-000000000000';
app.sensortag.BAROMETER_CONFIG = 'f000aa42-0451-4000-b000-000000000000';
app.sensortag.BAROMETER_CALIBRATION = 'f000aa43-0451-4000-b000-000000000000';
app.sensortag.BAROMETER_PERIOD = 'f000aa44-0451-4000-b000-000000000000';
app.sensortag.BAROMETER_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb';


app.sensortag.LUX_SERVICE = 'f000aa7004514000b000000000000000';
app.sensortag.LUX_SERVICE_DATA = 'f000aa7104514000b000000000000000';


app.sensortag.TEMP_SERVICE = 'f000aa0004514000b000000000000000';
app.sensortag.TEMP_SERVICE_DATA = 'f000aa0104514000b000000000000000';

let Services = {};


class Service {

    constructor(name){
        this.name = name
    }

    get name() {
        console.log('name = ' + this._name);

        return this._name;
    }

    set name(value) {
        this._name = value;
    }


}

class Battery extends Service{

    constructor(name){
        super(name);
        this.service_uuid = '180f',
        this.config_uuid = null,
        this.data_uuid = '2a19',
        this.period_uuid = null;
        this.service_needs_to_be_switched_on = false;

        this.handles= [];
        this._name = name;
    }

    add_characteristic_handle(uuid, handl){
        if (this.handles.indexOf(uuid) === -1) {
            this.handles[uuid] = handl
          //  console.log('==============================>',uuid);

        }else{
            console.log('Error, service with ID "'+uuid+'" already exits for '+this.name+ ' service');
        }

    }

    enableService(cb){
        if(this.service_needs_to_be_switched_on) {
            this.handles[this.config_uuid].write(Buffer.from(['0x01']), false, function (error) {
                if (!error) {
                    console.log('Enabled  ' + this.name);
                    cb();
                } else {
                    console.log('Error');
                }
            }.bind(this));
        }
        cb();
    }

    convertData(data){
        return data.readUInt8(0);
    }

    read(data, isNotification){
       data = this.convertData(data);
       console.log('battery level is now: ', data + '%');
    }

    subscribe(cb){
        console.log('Subscription ',this.data_uuid);
        this.handles[this.data_uuid].subscribe((error) => {
            console.log('Subscribed to ' + this.name);
            cb();
            if(error){
                console.log('ERRROR ',error);

            }

        });
    }

    addCharacteristics(characteristics, cb){
        for(let i in characteristics){
            console.log('  ' + i + ' uuid: ' + characteristics[i].uuid);
            this.add_characteristic_handle(characteristics[i].uuid, characteristics[i]);
        }
        cb();
    }


}


class Temp extends Service{

    constructor(name){
        super(name);
        this.service_uuid = 'f000aa0004514000b000000000000000',
            this.config_uuid = 'f000aa0204514000b000000000000000',
            this.data_uuid = 'f000aa0104514000b000000000000000',
            this.period_uuid = null;
        this.service_needs_to_be_switched_on = true;

        this.handles= [];
        this._name = name;
    }

    add_characteristic_handle(uuid, handl){
        if (this.handles.indexOf(uuid) === -1) {
            this.handles[uuid] = handl
         //   console.log('==============================>',uuid)

        }else{
            console.log('Error, service with ID "'+uuid+'" already exits for '+this.name+ ' service');
        }

    }

    enableService(cb){
        if(this.service_needs_to_be_switched_on) {
            //console.log('this.config_uuid: ',this.config_uuid);
            //console.log('this.handles ',this.handles);

            this.handles[this.config_uuid].write(Buffer.from(['0x01']), false, function (error) {
                if (!error) {
                    console.log('Enabled  ' + this.name);
                    cb();
                } else {
                    console.log('Error');
                }
            }.bind(this));
        }
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
    }

    subscribe(cb){
        console.log('Subscription ',this.data_uuid);
        this.handles[this.data_uuid].subscribe((error) => {
            console.log('Subscribed to ' + this.name);
            cb();
            if(error){
                console.log('ERRROR ',error);

            }

        });
    }

    addCharacteristics(characteristics,cb){
        for(let i in characteristics){
            this.add_characteristic_handle(characteristics[i].uuid, characteristics[i]);
        }
        cb();
    }

}


class Luxometer extends Service{

    constructor(name){
        super(name);
        this.service_uuid = 'f000aa7004514000b000000000000000',
            this.config_uuid = 'f000aa7204514000b000000000000000',
            this.data_uuid = 'f000aa7104514000b000000000000000',
            this.period_uuid = 'f000aa7304514000b000000000000000';
        this.service_needs_to_be_switched_on = true;

        this.handles= [];
        this._name = name;
    }

    add_characteristic_handle(uuid, handl){
        if (this.handles.indexOf(uuid) === -1) {
            this.handles[uuid] = handl;
           // console.log('==============================>',uuid);

        }else{
            console.log('Error, service with ID "'+uuid+'" already exits for '+this.name+ ' service');
        }

    }

    enableService(cb){
        if(this.service_needs_to_be_switched_on) {
           // console.log('this.config_uuid: ',this.config_uuid);
          //  console.log('this.handles ',this.handles);

            this.handles[this.config_uuid].write(Buffer.from(['0x01']), false, function (error) {
                if (!error) {
                    console.log('Enabled  ' + this.name);
                    cb();
                } else {
                    console.log('Error');
                }
            }.bind(this));
        }
    }

    convertData(data){
       // console.log('data: ', data);
       // console.log('data.length: ', data.length);
        //console.log('JSON.stringify(bufffer) ', JSON.stringify(data));

        var rawLux = data.readUInt16LE(0);

        var exponent = (rawLux & 0xF000) >> 12;
        var mantissa = (rawLux & 0x0FFF);

        var flLux = mantissa * Math.pow(2, exponent) / 100.0;
        return flLux;
    }

    read(data, isNotification){
        if(isNotification){
          //  console.log('Notification received')
        }
        let lux = this.convertData(data);
        console.log('LUX IS 0000>>> = '+ lux);
    }

    subscribe(cb){
        console.log('Subscription ',this.data_uuid);
        this.handles[this.data_uuid].subscribe((error) => {
            console.log('Subscribed to ' + this.name);
            cb();
            if(error){
                console.log('ERRROR ',error);

            }


        });
    }

    addCharacteristics(characteristics,cb){
        for(let i in characteristics){
            this.add_characteristic_handle(characteristics[i].uuid, characteristics[i]);
        }
        cb();
    }

}

Services.battery = Battery;
Services.temp = Temp;
Services.lux = Luxometer;

/*  peripheral.discoverServices(['180f'], function(error, services) {
      var deviceInformationService = services[0];
      console.log('discovered device information service');

      deviceInformationService.discoverCharacteristics(['2a19'], function(error, characteristics) {
          var batteryLevelCharacteristic = characteristics[0];
          console.log('discovered manufacturer '+characteristics);
          console.log('discovered manufacturer name characteristic');
          batteryLevelCharacteristic.read(function () {

          });
          batteryLevelCharacteristic.on('read', function(data, isNotification) {
              console.log('battery level is now: ', data.readUInt8(0) + '%');
             // peripheral.disconnect();
          });
      });
  }); */


module.exports.services = Services;