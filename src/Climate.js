import React, { Component } from 'react';
import {Row, Col} from 'reactstrap';

import './App.css';
const axios = require('axios');

export class Climate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      temperature: "--",
      humidity: "--",
      location: "--",
    };
  };


  componentWillMount() {
    axios.get('http://192.168.1.251/climate'
	)
    .then(response => {
      console.log(response.data);
      this.setState({
        temperature: response.data.temperature,
        humidity: response.data.humidity,
        location: response.data.location,

      });
    })
    .catch(error => {
      console.log(error);
    });
    }



render() {
    return (
      <div>
        <Row>
        <p style={{paddingLeft: "15px"}}>Location: {this.state.location}</p>
        </Row>
        <Row>
        <Col>
        <p>Temperature: {this.state.temperature}°C</p>
        <p>Humidity: {this.state.humidity}%</p>
        </Col>
        </Row>
        </div>
    );
  }
}

export default Climate;
