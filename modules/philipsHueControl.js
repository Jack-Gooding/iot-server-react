const PhilipsHue = require("node-hue-api");
HueApi = PhilipsHue.HueApi,
lightState = PhilipsHue.lightState;

exports.lightStatus = [2];

exports.hueScan = function() {


  let host = "192.168.1.64",
  username = "8FNEwdPyoc9eVRxP7ukCnf4QFowMK2aoHOmBuJdi",
  hueApi = new HueApi(host, username),
  state;

  var randomColourGen = parseInt(process.argv[2], 10) || `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`;
  console.log(randomColourGen);

  hueApi.lights(function(err, devices) {
      if (err) throw err;
      lightStatus = [];
      let lightsJSON = JSON.stringify(devices, null, 2);
      lightsJSON = JSON.parse(lightsJSON);
      lightsJSON = lightsJSON.lights;
      lightsJSON.forEach(function() {

        //If the light bulb is on, get info from the hub.
        if (lightsJSON[i].state.reachable) {
          lightStatus[0] =
            {
              "name":lightsJSON[i].name,
              "type":lightsJSON[i].type,
              "id":lightsJSON[i].id,
              "state":{
                  "on":lightsJSON[i].state.on,
                  "brightness":lightsJSON[i].state.bri,
                  // If bulb is RGB, return the converted CIE colour, else return 'N/A'
                  "rgb": (lightsJSON[i].type === 'Extended color light') ? colour_converter.cie_to_rgb(lightsJSON[i].state.xy[0],lightsJSON[i].state.xy[1],lightsJSON[i].state.brightness) : "rgb(240,200,140)" ,
                },
            }

        };
    });
    return lightStatus;
    lightStatus.forEach(function(light) {
      state = lightState.create().on().rgb(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255));
      hueApi.setLightState(light.id, state);
      console.log(light.id);
    });
  });
};
