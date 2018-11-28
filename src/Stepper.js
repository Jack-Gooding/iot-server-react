import React, { Component } from 'react';
import {Button, Row, Col} from 'reactstrap';

import './App.css';
const axios = require('axios');

export class Stepper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      direction: "clockwise",
      steps: 2000,
    };

    this.updateStepper = this.updateStepper.bind(this); //This is needed because getHueData uses the 'this' keyword
    this.handleChange = this.handleChange.bind(this); //This is needed because getHueData uses the 'this' keyword
    this.updateDirection = this.updateDirection.bind(this); //This is needed because getHueData uses the 'this' keyword

  };


  componentWillMount() {
    }

    handleChange(event) {
      this.setState({ steps: event.target.value });
    }

    updateDirection() {
      this.setState({ direction: (this.state.direction) === "clockwise" ? "counter-clockwise" : "clockwise",});
    }


    updateStepper() {
      axios.post(`http://192.168.1.163/stepper`, {
        steps: this.state.steps,
        direction: this.state.direction,
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
          <input value={this.state.steps} onChange={this.handleChange} />
          <Button onClick={this.updateStepper}>Submit</Button>
          <Button onClick={this.updateDirection}>Submit</Button>
          <p>{this.state.direction}</p>

        </Col>
        </Row>
        </div>
    );
  }
}

export default Stepper;
