var async = require('async');
const noble = require('noble');

var peripheralIdOrAddress = '08eed0f6c92e44618ac867e208394ec0';

noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        noble.startScanning();
    } else {
        noble.stopScanning();
    }
});

noble.on('discover', function(peripheral) {
    if (peripheral.id === peripheralIdOrAddress || peripheral.address === peripheralIdOrAddress) {
        noble.stopScanning();
        console.log('peripheral with ID ' + peripheral.id + ' found');
        explore(peripheral);
    }
});

function explore(peripheral) {
    console.log('services and characteristics:');

    peripheral.connect(() =>{
        console.log('Connecting');

        peripheral.once('disconnect', function() {
            console.log('Byebyey');
        });


        peripheral.discoverServices(false, function(error, services) {
            for(let i in services){
                console.log(' '+i+' : '+services[i].uuid);
            }
          //  peripheral.disconnect();
        });
    });

   // peripheral.on('disconnect', function() {
    //    process.exit(0);
   // });

    peripheral.once('connect', () =>{
        console.log('Yehahahah');

    });

    /*
    peripheral.on('connect', (error) => {
        if(error){
            console.log('Error', error);

        }else{
            console.log('Connected to: ' + peripheral.advertisement.localName);


        }

    });

    */


}

