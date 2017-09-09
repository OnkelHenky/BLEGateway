const BLEInterface = require('../ble_interface');
const Service = require('../services/service').services;
/**
 * Class to cover all functions to connect to a BLE device.
 */
class TISensortag extends BLEInterface{

    constructor (address){
        super(address);
        /*   this.serviceMap = new Map();


           this.serviceMap.set('Battery', new Services.battery('Battery'));
           this.serviceMap.set('Temperature', new Services.temp('Temperature'));
           this.serviceMap.set('Luxometer', new Services.lux('Luxometer'));*/

        this.addService('180f', new Service.Battery('Battery'));
        this.addService('f000aa0004514000b000000000000000', new Service.Temperature('Temperature'));
        this.addService('f000aa7004514000b000000000000000', new Service.Luxometer('Luxometer'));
    }


  /*  enableServices(peripheral){
        let test =[];
        for (var i in this.services){
            test.push(this.services[i].service_uuid)
        }


 //   console.log('test: lenght ', this.services.length);
  //  console.log('test: size  ', this.services.size);
var t = this.serviceMap.size;
    (function loop(services,i) {
        const promise = new Promise((resolve, reject) => {
            //console.dir(services);
            let service = services.next().value;
           // console.log('service : ',service);


            let servicename= service[0];
            let currentService= service[1];
         //  console.log('servicename '+ servicename + ' objec: ',  service_objecxt);


          // console.log('service_objecxt.service_uuid '+ service_objecxt.service_uuid);

            peripheral.discoverServices([currentService.service_uuid], function(error, services) {
                for (let x in services) {
                   // let currentService = this.services[services[x].uuid];
                  //  console.log('service['+x+'].uuid : ', services[x].uuid);
                  //  console.log('i '+ i);
                   // console.log('servicename '+ servicename);
                   // console.log('currentService ', currentService);
                    currentService.add_characteristic_handle(services[x].uuid, services[x]);
                    console.log('service['+x+'].uuid : ', services[x].uuid);

                    services[x].discoverCharacteristics(null, function(error, characteristics) {

                        console.log('currentService :' + currentService.service_uuid);

                        currentService.addCharacteristics(characteristics,function(){
                            currentService.enableService(function(){
                                currentService.subscribe(function(){
                                    characteristics[0].on('read', currentService.read.bind(currentService));
                                    resolve();
                                });
                            });
                        });



                        for (let x in characteristics) {
                            console.log('  ' + x + ' uuid: ' + characteristics[0].uuid);
                           // if(characteristics[x].uuid === currentService.data_uuid){

                           // } currentService.read.bind(currentService)
                        }
                       characteristics[0].read(function () {

                       });


                                       //resolve();

                    });

                }

            });
          //  let currentService = services.next().value;


          // console.log('Service at position '+ i + ' ', currentService);
          //  resolve(); // resolve it!
        }).then( () => i >=  t || loop(services, i+1) ).catch((err) => {
            console.log('Error :', err)
        });
    })( this.serviceMap.entries(),1);


        const timeout = Math.random() * 600;
            setTimeout( () => {
                console.log(i);
                resolve(); // resolve it!
            }, timeout);


        for (var i in this.services){
          console.log('Services ' + i +' ' + this.services[i] );


        peripheral.discoverServices(test, function(error, services) {
            //  var deviceInformationService = services[0];
            // console.log('this', this.);

            for (var x in services) {
                //     console.log('currentService : ', services[x]);
                let currentService = this.services[services[x].uuid];


                //      console.log('  ' + x + ' uuid: ' + services[x].uuid);
                currentService.add_characteristic_handle(currentService.service_uuid, services[x]);
                console.log('discovered device information service');

                services[x].discoverCharacteristics(null, function(error, characteristics) {
                    //console.log('currentService.data_uuid: ',characteristics);

                    for (var x in characteristics) {
                        console.log('  ' + x + ' uuid: ' + characteristics[x].uuid);
                    }

                    currentService.addCharacteristics(characteristics);
                    currentService.enableService();
                    currentService.subscribe();

                    var batteryLevelCharacteristic = characteristics[0];
                    // console.dir(batteryLevelCharacteristic);

                    //  currentService.add_characteristic_handle(currentService.data_uuid,batteryLevelCharacteristic);
                    // console.log('discovered manufacturer '+characteristics);
                    console.log('discovered manufacturer name characteristic');
                    batteryLevelCharacteristic.read(function () {

                    });
                    batteryLevelCharacteristic.on('read', currentService.read.bind(currentService));

                });
            }
        }.bind(this));

        }

    }
*/
    /**
     *
     * @param peripheral
     */
    enableServices(peripheral){
        let test =[];
        for (var i in this.services){
            test.push(this.services[i].service_uuid)
        }
        console.log('test: ', test);

        //for (var i in this.services){
          //  console.log('Services ' + i +' ' + this.services[i] );


            peripheral.discoverServices(test, function(error, serv) {
              //  var deviceInformationService = services[0];
               // console.log('this', this.);
                console.log('this.services : ', this.services);
                for (var x in serv) {
               console.log('serv[x].uuid : ', serv[x].uuid);

                    let currentService = this.services[serv[x].uuid];
                    console.log('currentService : ', currentService.service_uuid);

              //      console.log('  ' + x + ' uuid: ' + services[x].uuid);
                currentService.add_characteristic_handle(currentService.service_uuid, serv[x]);
              //  console.log('discovered device information service');

                serv[x].discoverCharacteristics(null, function(error, characteristics) {
                  //console.log('currentService.data_uuid: ',characteristics);

                    for (var x in characteristics) {
                        console.log('  ' + x + ' uuid: ' + characteristics[x].uuid);
                    }

                    currentService.addCharacteristics(characteristics);
                    currentService.enableService();
                    currentService.subscribe();

                    var batteryLevelCharacteristic = characteristics[0];
                   // console.dir(batteryLevelCharacteristic);

                  //  currentService.add_characteristic_handle(currentService.data_uuid,batteryLevelCharacteristic);
                   // console.log('discovered manufacturer '+characteristics);
                    console.log('discovered manufacturer name characteristic');
                    batteryLevelCharacteristic.read(function () {

                    });
                    batteryLevelCharacteristic.on('read', currentService.read.bind(currentService));

                });
                }
            }.bind(this));
        //}



    }

}

module.exports = TISensortag;