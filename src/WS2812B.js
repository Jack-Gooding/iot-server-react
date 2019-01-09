import React, { Component } from 'react';
import {Row, Col} from 'reactstrap';

import './App.css';
const axios = require('axios');

export class WS2812B extends Component {

  constructor(props) {
    super(props);
    this.state = { //set default state
      id: 0,
      leds: [{
        red: 255,
        green: 0,
        blue: 0,
      },{
        red: 0,
        green: 255,
        blue: 0,
      },
      {
        red: 0,
        green: 0,
        blue: 255,
      }],
    };

    this.handleSlider = this.handleSlider.bind(this); //This is needed because getHueData uses the 'this' keyword
    this.updateLEDs = this.updateLEDs.bind(this); //This is needed because getHueData uses the 'this' keyword
    this.handleChange = this.handleChange.bind(this); //This is needed because getHueData uses the 'this' keyword

  };


  componentWillMount() {
    this.isPalindrome("palap");
    axios.get(`http://192.168.1.163/leds`)
    .then(response => {
      console.log(response.data);
      let ledArray = [];
      for (var key in response.data) {
        console.log(response.data);
        ledArray.push({
          red: response.data[key].split('[')[1].split(']')[0].split(',')[0],
          green:  response.data[key].split('[')[1].split(']')[0].split(',')[1],
          blue:  response.data[key].split('[')[1].split(']')[0].split(',')[2],
        });
      };
      console.log(ledArray);
      this.setState({
        leds: ledArray,
      });

    })
    .catch(error => {
      console.log(error);
    });
    }



    handleSlider(event) {
      let ledArray = this.state.leds;
      ledArray[this.state.id][event.target.getAttribute('color')] = event.target.value
      this.setState({leds: ledArray,});
    };

    handleChange(param, event) {
      this.setState({ id: param });
      //console.log(event.target.getAttribute('index'))
    }

    updateLEDs() {
      axios.post(`http://192.168.1.163/leds`, {
        red: this.state.leds[this.state.id].red,
        green: this.state.leds[this.state.id].green,
        blue: this.state.leds[this.state.id].blue,
        id: this.state.id,
        headers: {
        'Content-Type': 'application/json'
    }})
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
    }

    isPalindrome(number) {
      number = String(number).split("");
      let p = true;
      number.forEach((n, i) => {
        if (n !== number[number.length-i-1]) {
          p = false;
          //console.log(`n: ${n}, number[number.length-i]: ${number[number.length-i-1]}`)
        };
      });
      //console.log(p);
      return p;
    };


render() {
    return (
      <div>
        <Row>
        <Col>
        <input style={{width: "100%", }} type="range" min="0" max="255" color="red" value={this.state.leds[this.state.id].red} onChange={this.handleSlider} onMouseUp={this.updateLEDs}/>
        <input style={{width: "100%", }} type="range" min="0" max="255" color="green" value={this.state.leds[this.state.id].green} onChange={this.handleSlider} onMouseUp={this.updateLEDs}/>
        <input style={{width: "100%", }} type="range" min="0" max="255" color="blue" value={this.state.leds[this.state.id].blue} onChange={this.handleSlider} onMouseUp={this.updateLEDs}/>
        {this.state.leds.map((led, i) =>
          <div key={i} index={i} onClick={this.handleChange.bind(this, i)} style={ { background: `rgb(${ led.red },${ led.green },${ led.blue })`, width: `40px`, height: `40px`, borderRadius: `6px`, border: `solid 1px black`, display: `inline-block`} }></div>
          )
        }
        </Col>
        </Row>
        </div>
    );
  }
}

export default WS2812B;
