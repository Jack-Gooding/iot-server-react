import React, { Component } from 'react';
import {Row, Col} from 'reactstrap';
import HueColour from './HueColour';

const axios = require('axios');

export class HueContainer2 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lights: [
        {
          name: "Bathroom",
          id: 1,
          type: "Dimmable",
          on: true,
          brightness: 85,
          rgb: "rgb(240,220,200)",
        },
        {
          name: "Spare Bulb",
          id: 2,
          type: "Dimmable",
          on: false,
          brightness: 100,
          rgb: "rgb(240,220,200)",
        },
        {
          name: "Bedroom Light",
          id: 3,
          type: "Extended color light",
          on: true,
          brightness: 100,
          rgb: "rgb(255,100,255)",
        },
        {
          name: "Bedside Lamp",
          id: 4,
          type: "Extended color light",
          on: false,
          brightness: 100,
          rgb: "rgb(255,255,100)",
        }],

    };

    this.handleSlider = this.handleSlider.bind(this); //This is needed because getHueData uses the 'this' keyword
    this.getHueData = this.getHueData.bind(this);
    this.handleChange = this.handleChange.bind(this); //This is needed because getHueData uses the 'this' keyword


  };


  componentWillMount() {
    //this.getHueData();
    }

    getHueData() {
      axios.get('/api/hue')
        .then(response => {
          // handle success
          //console.log(response.data);
          let lightArray = [];
          response.data.forEach(element => {
            lightArray.push({
              name: element.name,
              id: element.id,
              type: element.type,
              on: element.on,
              brightness: element.brightness,
              rgb: element.rgb,
            })
          });
          this.setState({lights: lightArray});
          console.log(lightArray);
        })
        .catch(error => {
          // handle error
          console.log(error);
        })
        .then(() => {
          // always executed
        });
    };

  handleSlider(index) {
    //this.setState({[event.target.getAttribute('color')]: event.target.value});
    // Send a POST request
    axios.post('/api/hue', {
      brightness:  this.state.lights[index].brightness,
      red:  this.state.lights[index].rgb.split('rgb(')[1].split(')')[0].split(',')[0],
      green:  this.state.lights[index].rgb.split('rgb(')[1].split(')')[0].split(',')[1],
      blue:  this.state.lights[index].rgb.split('rgb(')[1].split(')')[0].split(',')[2],
      id: this.state.lights[index].id,
    })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  };

  handleChange(event) {
    let newValue = event.target.value;
    let currentState = this.state.lights;
    let index = event.target.getAttribute('index');
    let color = event.target.getAttribute('color-id');
    console.log(color);
    if (color === null) {
      currentState[index].brightness = newValue;
    } else {
      console.log(color);
      let rgb = this.state.lights[index].rgb;
      //console.log(rgb);
      rgb = rgb.split('rgb(')[1].split(')')[0].split(',');
      rgb[color] = newValue;
      rgb = `rgb(${rgb.join(",")})`
      currentState[index].rgb = rgb;
    }
    this.setState({
      lights: currentState
    });
    this.handleSlider(index);
  }



render() {
    return (
      <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-evenly"}}>
      {this.state.lights.map( (light, i) =>
        <div key={i} style={{border: "solid 1px black",flexGrow: "0", margin: "1%", borderRadius: "10px", width: "20%"}}>
        <div style={{  position: "relative",
  display: "inline-block", /* <= shrinks container to image size */}}>
        <img src={require("./favicon.png")} alt="test" style={{top: "-20px", width: "100%"}}/>
        <svg style={{  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
height: "100%"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" preserveAspectRatio="xMidYMid meet" width="256pt" height="256pt" version="1.0">
        <metadata>
        Created by potrace 1.15, written by Peter Selinger 2001-2017
        </metadata>
        <g fill={`rgb(${light.rgb.split('rgb(')[1].split(')')[0].split(',')[0]},${light.rgb.split('rgb(')[1].split(')')[0].split(',')[1]},${light.rgb.split('rgb(')[1].split(')')[0].split(',')[2]})`} stroke="none" transform="translate(0 256) scale(0.1 -0.1)">
        <path d="M 1195 2210 c -220 -30 -408 -183 -487 -396 c -18 -49 -22 -81 -23 -184 c 0 -162 18 -218 128 -383 c 98 -149 107 -170 107 -247 l 0 -60 l 360 0 l 360 0 l 0 64 c 0 74 18 114 122 267 c 92 134 113 201 113 354 c 0 99 -4 131 -23 187 c -93 268 -371 436 -657 398 Z m -70 -530 c 20 -27 40 -50 43 -50 c 4 1 25 23 46 50 c 22 28 45 50 52 50 c 7 0 34 -25 60 -55 l 47 -54 l 40 49 c 22 28 45 50 51 50 c 15 0 116 -102 116 -117 c 0 -25 -26 -13 -69 31 l -44 45 l -40 -50 c -22 -27 -46 -49 -53 -49 c -7 0 -34 25 -59 55 l -47 55 l -45 -55 c -25 -30 -51 -55 -58 -55 c -6 0 -26 20 -44 45 c -17 24 -36 47 -41 50 c -5 3 -23 -15 -41 -40 c -31 -44 -59 -59 -59 -32 c 0 19 82 127 96 127 c 7 0 29 -22 49 -50 Z" />
        </g>
        </svg>
        </div>
          <div>{light.name} {light.on ? "yes": "no"} </div>
          <div style={{margin:"2%",}}>
            <div style={{display: "flex", flexWrap: "nowrap", flexDirection: "column",}}>
                <input style={{flexGrow: 1,}} min="0" max="255" color-id="0" color="red" onChange={this.handleChange} value={this.state.lights[i].rgb.split('rgb(')[1].split(')')[0].split(',')[0]}  type="range" index={i}/>
                <input style={{width: "100%"}} min="0" max="255" color-id="1" color="green" onChange={this.handleChange} value={this.state.lights[i].rgb.split('rgb(')[1].split(')')[0].split(',')[1]}  type="range" index={i}/>
                <input style={{}} min="0" max="255" color-id="2" color="blue" onChange={this.handleChange} value={this.state.lights[i].rgb.split('rgb(')[1].split(')')[0].split(',')[2]}  type="range" index={i}/>
            </div>
            <div>
              <input style={{width: "100%"}} min="0" max="255" color="brightness" onChange={this.handleChange} value={this.state.lights[i].brightness} type="range" index={i}/>
            </div>
            </div>
        </div>
        )}
      </div>
    );
  }
}

export default HueContainer2;
