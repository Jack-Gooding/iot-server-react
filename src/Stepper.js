import React, { Component } from 'react';
import {Button, Row, Col} from 'reactstrap';

import './App.css';
const axios = require('axios');

export class Stepper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPosition: 0,
      maxSpeed: 0,
      acceleration: 0,
      speed: 0,
    };

    this.updateStepper = this.updateStepper.bind(this); //This is needed because getHueData uses the 'this' keyword
    this.handleChange = this.handleChange.bind(this); //This is needed because getHueData uses the 'this' keyword
    this.updateDirection = this.updateDirection.bind(this); //This is needed because getHueData uses the 'this' keyword

  };


  componentWillMount() {
    axios.get(`http://192.168.1.158/blinds`)
    .then(response => {
      console.log(response.data);
      this.setState({
        currentPosition: response.data.deploymentSteps,
        maxSpeed: response.data.MaxSpeed,
        acceleration: response.data.Acceleration,
        speed: response.data.Speed,
      });

    })
    .catch(error => {
      console.log(error);
    });
    }

    handleChange(event) {
      this.setState({ [event.target.getAttribute('data-name')]: event.target.value });
    }

    updateDirection() {
      this.setState({ direction: (this.state.direction) === "clockwise" ? "counter-clockwise" : "clockwise",});
    }


    updateStepper() {
      axios.post(`http://192.168.1.158/blinds`, {//163//158
        moveDistance: this.state.currentPosition,
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


render() {
    return (
      <div>
        <Row>
        <Col>
          <input value={this.state.currentPosition} data-name="currentPosition" onChange={this.handleChange} />
          <Button onClick={this.updateStepper}>Submit</Button>
          <input type="range" min="-65000" max="0" value={this.state.currentPosition} data-name="currentPosition" onChange={this.handleChange}/>
          <p>Current Position {this.state.currentPosition}</p>
          <input type="range" min="0" max="2000" value={this.state.maxSpeed} data-name="maxSpeed" onChange={this.handleChange}/>
          <p>Max Speed {this.state.maxSpeed}</p>
          <input type="range" min="0" max="200" value={this.state.acceleration} data-name="acceleration" onChange={this.handleChange}/>
          <p>Acceleration {this.state.acceleration}</p>
          <input type="range" min="0" max="2000" value={this.state.peed} data-name="speed" onChange={this.handleChange}/>
          <p>Speed {this.state.speed}</p>

        </Col>
        </Row>
        </div>
    );
  }
}

export default Stepper;
