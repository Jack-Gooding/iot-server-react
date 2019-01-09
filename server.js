//==========================//
//      Created modules     //
//==========================//

const colour_converter = require('./modules/colour_converter'); // Custom module to convert Philips CIE values to RGB and visa versa

//==========================//
// Node.js // npm  packages //
//==========================//

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PhilipsHue = require("node-hue-api");
const TPLSmartDevice = require('tplink-lightbulb'); //Allows control of TP-Link HS100 Wifi smart plugs

let tplinkPlugs = [];

const scan = TPLSmartDevice.scan() // Scans Local WiFi for packets from TP-Link devices
  .on('light', light => {
    light.info()
      .then(status => {
        console.log(light);
          let newPlug = { //reads info from returned event emitter, parses useful info into an object, and pushes to array.
            name: light._sysinfo.alias,
            ip: light.ip,
            on: light._sysinfo.relay_state,
            on_time: light._sysinfo.on_time,
          };
          tplinkPlugs.push(newPlug)
          scan.stop();
      })
      .catch(error => {
      })
});

HueApi = PhilipsHue.HueApi,
lightState = PhilipsHue.lightState;


let host = "192.168.1.64",
username = "8FNEwdPyoc9eVRxP7ukCnf4QFowMK2aoHOmBuJdi",
hueApi = new HueApi(host, username),
state;


let lightStatus = [];

hueApi.lights(function(err, devices) {
    let reachableDevices = 0;
    if (err) throw err;
    let lightsJSON = JSON.stringify(devices, null, 2);
    lightsJSON = JSON.parse(lightsJSON);
    lightsJSON = lightsJSON.lights;
    //console.log(lightsJSON.length);

    for (let i = 0; i < lightsJSON.length; i++) {
      //console.log(lightsJSON[i]);
      //If the light bulb is on, get info from the hub.
      console.log(`Found bulb: '${lightsJSON[i].name}', State:${lightsJSON[i].state.reachable}`)
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
  console.log(`Found ${lightStatus.length} lights.`);
  console.log(lightStatus);
  if (process.argv[2].toLowerCase() === "random") {
    //console.log("randomising lights");
    lightStatus.forEach(function(light) {
      state = lightState.create().on().rgb(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)).brightness(Math.floor(Math.random()*255));
      hueApi.setLightState(light.id, state);
    });
  };
});

//==============//
// Server logic //
//==============//

const port = process.env.PORT || 5000; //To change this in windows, run set PORT <PORT> in shell, in linux run PORT <PORT> node server.js

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});




app.get('/api/hue', (req, res) => {
  console.log("/api/hue")
  console.log(lightStatus);
  res.send(lightStatus);
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
  console.log(req.body);
  state = lightState.create().on().rgb(req.body.red,req.body.green,req.body.blue).brightness(req.body.brightness);
  if (req.body.brightness <= 5) {state.off(); };
  hueApi.setLightState(req.body.id, state);
  res.send(lightStatus);
});

app.post('/api/tplink', (req, res) => {
  console.log(req.body);
  let plugIp = req.body.ip;
  tplinkPlugs[req.body.index].on = req.body.on === 1 ? 0 : 1;
  const plug = new TPLSmartDevice(plugIp)
  plug.power(req.body.on === 1 ? 0 : 1)
.then(status => {
  console.log("Turning "+req.body.name+" "+(req.body.on === 1 ? "off" : "on")+"!");
  res.send(tplinkPlugs);
})
.catch(err => console.error(err))
});

app.get('/api/tplink', (req, res) => {
  console.log("tplink");
  res.send(tplinkPlugs);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
