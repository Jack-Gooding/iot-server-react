# iot-react-server

This is a server I've made for personal use, to control the IoT devices in my home and as a challenge to learn and develop more React.js Skills.

Two Node.js instances are required to run the IoT Server API, and the react renderer.

## Semi-function demo available at: http://35.178.73.23:3000/

### The devices that this server currently can control:
  - Philips Hue
  - TP-Link Smart Plugs
  - Several NodeMCU ESP8266 arduino devices which I have connected to several WS2812b LED Strips, Stepper Motors, and Temperature/Humidity sensors.
  - It also pulls weather data from the Met Office weather forecast API

  
### Plans for future updates

 - SQL database for internal temps/humidity logging and graphing
 - Improved layouts and separation of concerns between components
 - Some more APIs
 - Better error handling when servers don't respond in a timely fashion
