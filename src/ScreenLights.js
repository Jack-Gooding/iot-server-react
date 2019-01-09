import React, { Component } from 'react';
import {Row, Col} from 'reactstrap';

import './App.css';
const axios = require('axios');

export class ScreenLights extends Component {

  constructor(props) {
    super(props);
    this.state = { //set default state
      onState: "off",
    };

    this.handleChange = this.handleChange.bind(this); //This is needed because getHueData uses the 'this' keyword
    this.updateLEDs = this.updateLEDs.bind(this);
  };


  componentWillMount() {
    axios.get(`http://192.168.1.163/screen-lights`)
    .then(response => {
      console.log(response.data);
      this.setState({
        onState: response.data.onState,
      });

    })
    .catch(error => {
      console.log(error);
    });
    }


    handleChange(param, event) {
      this.setState({ id: param });
      //console.log(event.target.getAttribute('index'))
    }

    updateLEDs() {
      axios.post(`http://192.168.1.163/screen-lights`, {
        onState: this.state.onState === "on" ? "off" : "on",
        headers: {
        'Content-Type': 'application/json'
    }})
      .then(response => {
        console.log(response);
        this.setState({
          onState: this.state.onState === "on" ? "off" : "on",
        });
      })
      .catch(error => {
        console.log(error);
      });
    }


render() {
    return (
      <div>
        <Row onClick={this.updateLEDs}>
          {this.state.onState}
        </Row>
        </div>
    );
  }
}

export default ScreenLights;
