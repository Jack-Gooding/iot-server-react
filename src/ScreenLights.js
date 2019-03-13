import React, { Component } from 'react';
import {Row, } from 'reactstrap';
import Slider from './Slider';

import './App.css';
const axios = require('axios');


export class ScreenLights extends Component {

  constructor(props) {
    super(props);
    this.state = { //set default state
      onState: false,
    };

    this.handleChange = this.handleChange.bind(this); //This is needed because getHueData uses the 'this' keyword
    this.updateLEDs = this.updateLEDs.bind(this);
    //this.getStyle = this.getStyle.bind(this);
  };


  componentWillMount() {
    axios.get(`http://192.168.1.251/screen-lights`)
    .then(response => {
      console.log(response.data);
      this.setState({
        onState: response.data.onState === "on" ? true : false,
      });
      console.log(this.state.onState);

    })
    .catch(error => {
      console.error(error);
    });
    }


    handleChange() {

    }

    updateLEDs() {
      console.log(this.state.onState);
      axios.post(`http://192.168.1.251/screen-lights`, {
        onState: this.state.onState ? "off" : "on",
        headers: {
        'Content-Type': 'application/json'
    }})
      .then(response => {
        console.log(response.data);
        this.setState({
          onState: response.data.onState === "on" ? true : false,
        });
      })
      .catch(error => {
        console.log(error);
      });
    }

    /*getStyle() {
      return {
        cursor: 'pointer',
        color: this.state.onState === "on" ? 'green' : 'red',
      }
    }*/


render() {
    return (
        <Row style={{display: "flex", justifyContent: "center"}}>
          <div  style={{border: "solid 1px black", borderRadius: "10px"}}>
          <p>{this.state.onState? "On" : "Off"}</p>
          <Slider type="range" min="0" max="1"  onChange={this.updateLEDs} datapower={this.state.onState} value={this.state.onState ? 1 : 0}/>
          </div>
        </Row>
    );
  }
}

//<PowerIndicator update={this.updateLEDs} onState={this.state.onState}/>
export default ScreenLights;
