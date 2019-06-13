//==========================//
//      Created modules     //
//==========================//

const colour_converter = require('./modules/colour_converter'); // Custom module to convert Philips CIE values to RGB and visa versa
const tpLink = require('./modules/tpLink'); // Custom module to convert Philips CIE values to RGB and visa versa

//==========================//
// Node.js // npm  packages //
//==========================//

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const axios = require('axios');
const PhilipsHue = require("node-hue-api");


const Database = require('better-sqlite3');
//https://github.com/JoshuaWise/better-sqlite3/blob/f9166c0199b10455b21c217a6749a4438b553de3/docs/api.md
const db = new Database('./server.db', {verbose: console.log });
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

//when formatting for date and time, "YYYY-MM-DD HH:MM:SS" is the appropriate format to use.

const createDb1 = db.prepare(`CREATE TABLE if not exists climate(
                                          temperatureid integer PRIMARY KEY,
                                          datetime TEXT DEFAULT CURRENT_TIMESTAMP,
                                          location TEXT NOT NULL,
                                          temperature NUMBER NOT NULL,
                                          humidity NUMBER NOT NULL
                                          )`);
createDb1.run();

const createDb2 = db.prepare(`CREATE TABLE if not exists door(
                                          readingid integer PRIMARY KEY,
                                          datetime TEXT DEFAULT CURRENT_TIMESTAMP,
                                          location TEXT NOT NULL,
                                          openState text NOT NULL
                                          )`);
createDb2.run();

const insertClimate = db.prepare(`INSERT INTO climate(location, temperature, humidity) VALUES($location, $temperature, $humidity)`);
const insertDoor = db.prepare(`INSERT INTO door(location, openState) VALUES($location, $openState)`);
const dropDoor = db.prepare(`DROP TABLE IF EXISTS door`);
function getClimateData() {

  axios.get('http://192.168.1.251/climate')
  .then(response => {
    insertClimate.run({
      temperature: response.data.temperature,
      humidity: response.data.humidity,
      location: response.data.location
    });
  })
  .catch(error => {
    console.log(error);
  });
} ;

setInterval(function() {
  getClimateData();
},1000*60*10);
getClimateData();

const readClimate = db.prepare(`SELECT * FROM climate ORDER BY temperatureid DESC limit 80`);
//console.log(readClimate.all());
const readDoorTable = db.prepare(`SELECT * FROM door ORDER BY readingid DESC limit 80`);


//const TPLSmartDevice = require('tplink-lightbulb'); //Allows control of TP-Link HS100 Wifi smart plugs
const {Client} = require('tplink-smarthome-api');//Allows control of TP-Link HS100 Wifi smart plugs
let tpDiscoveryTimeout = 1000;
let tpDiscoveryInterval = 2000;
let tpDiscoveryCheck = false;
//https://github.com/plasticrake/tplink-smarthome-api/blob/master/API.md

let tplinkPlugs = [];

  const TPLink = new Client();

  function gatherTPLink() {
    // Look for devices, log to console, and turn them on
    if (!tpDiscoveryCheck) {
    console.log("Searching for TP Link devices...")
    tpDiscoveryCheck = true;

    TPLink.startDiscovery({
        discoveryInterval: tpDiscoveryInterval,
        discoveryTimeout: tpDiscoveryTimeout,
        offlineTolerance: 5,

    }).on('device-new', (device) => {
      device.getSysInfo()
      .then( () => {
        let notExist = true;
        console.log(device._sysInfo);
        tplinkPlugs.forEach(function(d) { //fixes issue with occasional duplicate items
          if (device._sysInfo.deviceId === d._sysInfo.deviceId) {
            notExist = false;
          }
        });
        if (notExist) {
          tplinkPlugs.push(device);
          console.log(`${device.alias}: ${device._sysInfo.relay_state}`);
      }
      }).catch(function(err) {
        console.log(err);
      });
      device.setPowerState(true);
    }).on('device-offline', (device) => {
      console.log(device);
      console.log(`${device.alias} offline!`);
    }).on('discovery-invalid', (error) => {
      console.log(error);
      console.log("Discovery failed.");
    }).on('error', (error) => {
      console.log(error);
    });
    setTimeout(function(){
      tpDiscoveryCheck = false;
      TPLink.stopDiscovery();
    }, tpDiscoveryTimeout);

  }
}
gatherTPLink();



HueApi = PhilipsHue.HueApi,
lightState = PhilipsHue.lightState;

let host = "192.168.1.64",
username = "8FNEwdPyoc9eVRxP7ukCnf4QFowMK2aoHOmBuJdi",
hueApi = new HueApi(host, username),
state;


let lightStatus = [];

function getHueLightData() {
  /*hueApi.lights(function(err, devices) {
      let reachableDevices = 0;
      if (err) throw err;
      let lightsJSON = JSON.stringify(devices, null, 2);
      lightsJSON = JSON.parse(lightsJSON);
      lightsJSON = lightsJSON.lights;
      //console.log(lightsJSON.length);

      for (let i = 0; i < lightsJSON.length; i++) {
        console.log(`${lightsJSON[i].name}: ${lightsJSON[i].state.on}`);
        //console.log(lightsJSON[i]);
        //If the light bulb is on, get info from the hub.
        //if (lightsJSON[i].state.reachable) {
          reachableDevices++;
          lightStatus.push(
            {
              "name":lightsJSON[i].name,
              "type":lightsJSON[i].type,
              "id":lightsJSON[i].id,
              "on":lightsJSON[i].state.on,
              "reachable":lightsJSON[i].state.reachable,
              "brightness":lightsJSON[i].state.bri,
                  // If bulb is RGB, return the converted CIE colour, else return 'N/A'
              "rgb": (lightsJSON[i].type === 'Extended color light') ? colour_converter.cie_to_rgb(lightsJSON[i].state.xy[0],lightsJSON[i].state.xy[1],lightsJSON[i].state.brightness) : "rgb(240,200,140)" ,
            }
          );
        //};

    };
    lightStatus = lightStatus.slice((lightStatus.length - reachableDevices));
    console.log(`  Found ${lightStatus.length} lights.`);
    lightStatus.forEach(function(device) {
      console.log(`    ${device.name}: ${device.on}`);
    })
    if (process.argv[2].toLowerCase() === "random") {
      //console.log("randomising lights");
      lightStatus.forEach(function(light) {
        state = lightState.create().on().rgb(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)).brightness(Math.floor(Math.random()*255));
        hueApi.setLightState(light.id, state);
      });
    };
  });*/
  hueApi.lights()
    .then(function(result) {
      //console.log(JSON.stringify(result, null, 2));
      let reachableDevices = 0;
      let lightsJSON = JSON.stringify(result, null, 2);
      lightsJSON = JSON.parse(lightsJSON);
      lightsJSON = lightsJSON.lights;
      //console.log(lightsJSON.length);

      for (let i = 0; i < lightsJSON.length; i++) {
        //console.log(lightsJSON[i]);
        //If the light bulb is on, get info from the hub.
        //if (lightsJSON[i].state.reachable) {
          reachableDevices++;
          lightStatus.push(
            {
              "name":lightsJSON[i].name,
              "type":lightsJSON[i].type,
              "id":lightsJSON[i].id,
              "on":lightsJSON[i].state.on,
              "reachable":lightsJSON[i].state.reachable,
              "brightness":lightsJSON[i].state.bri,
                  // If bulb is RGB, return the converted CIE colour, else return 'N/A'
              "rgb": (lightsJSON[i].type === 'Extended color light') ? colour_converter.cie_to_rgb(lightsJSON[i].state.xy[0],lightsJSON[i].state.xy[1],lightsJSON[i].state.brightness) : "rgb(240,200,140)" ,
            }
          );
        //};

    };
    lightStatus = lightStatus.slice((lightStatus.length - reachableDevices));
    console.log(`  Found ${lightStatus.length} lights.`);
    lightStatus.forEach(function(device) {
      console.log(`    ${device.name}: ${device.on}`);
    })

    })
    .catch(function(error) {
      console.log(error);
    })
    .done();
}

getHueLightData();


//==============//
// Server logic //
//==============//

const port = process.env.PORT || 3200; //To change this in windows, run set PORT <PORT> in shell, in linux run PORT <PORT> node server.js

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});




app.get('/api/hue', (req, res) => {
  console.log("/api/hue")
  //console.log(lightStatus);
  res.send(lightStatus);
});

app.get('/api/update-hue', (req, res) => {
  console.log("/api/update-hue")
  getHueLightData();
  res.send("updated");
});

app.get('/api/hueLight/:lightId', (req, res) => {
  console.log(req.params);
  let requestedLight = [{Error: "Nothing Found"}];
  lightStatus.forEach(function(light) {
    if (light.id === req.params.lightId) {
      requestedLight = light;
    };
  });
  res.send(requestedLight);
});

app.post('/api/hue', (req, res) => {

  state = lightState.create().on().rgb(req.body.red,req.body.green,req.body.blue).brightness(req.body.brightness);
  if (req.body.on === false) {
    state.off();
  };
  hueApi.setLightState(req.body.id, state);
  res.send(lightStatus);
});

app.post('/api/tplink', (req, res) => {
  console.log(req.body);
  tplinkPlugs.forEach(function(device) {
    if (device.alias === req.body.name) {
      console.log(device._sysInfo.relay_state);
      device.setPowerState(!req.body.on).then(function(response) {
        console.log(response);
        console.log(device._sysInfo.relay_state);
        let payload = [];
        tplinkPlugs.forEach(function(device) {
          payload.push({
            name: device.alias,
            ip: device.host,
            on: device._sysInfo.relay_state ? true : false,
            status: device.status,
          });
        })
        res.send(payload);
      });
    };
  });
  //let plugIp = req.body.ip;
  //tplinkPlugs[req.body.index].on = req.body.on === 1 ? 0 : 1;
  /*const plug = new TPLSmartDevice(plugIp)
  plug.power(req.body.on === 1 ? 0 : 1)
.then(status => {
  console.log("Turning "+req.body.name+" "+(req.body.on === 1 ? "off" : "on")+"!");
  res.send(tplinkPlugs);
})
.catch(err => console.error(err))*/

});

app.get('/api/tplink', (req, res) => {
  let payload = [];
  tplinkPlugs.forEach(function(device) {
    payload.push({
      name: device.alias,
      ip: device.host,
      on: device._sysInfo.relay_state ? true : false,
      status: device.status,
    });
  })
  res.send(payload);
});

app.get('/climate', (req, res) => {
  res.send(readClimate.all());
});

app.post('/doorlatch', (req, res) => {

  console.log(req.body);

  insertDoor.run({
    location: req.body.location,
    openState: req.body.state
  });
  res.send("POST received");
});

app.get('/doorlatch', (req, res) => {
  let data = readDoorTable.all();
  console.log(data[0]);
  console.log(data[1]);
  console.log(data[2]);
  console.log(data[3]);

  res.send(data);
});

app.get('/doorlatchdelete', (req, res) => {
  dropDoor.run();
  createDb2.run();
  res.send("Deleted table.");
})

app.get('/api/refresh', (req, res) => {
  console.log('refreshing devices...')
  let payload = [];
  tplinkPlugs.forEach(function(device) {
    console.log(device.alias);
    payload.push({
      name: device.alias,
      ip: device.host,
      on: device._sysInfo.relay_state ? true : false,
      status: device.status,
    });
  })
    res.send(payload);
    gatherTPLink();
});

app.listen(port, () => console.log(`Listening on port ${port}`));
