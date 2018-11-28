import React, { Component } from 'react';
import {Row, Col} from 'reactstrap';
import HueColour from './HueColour';

const axios = require('axios');

export class HueContainer extends Component {

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

  };


  componentWillMount() {
    this.getHueData();
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

  handleSlider(event) {
    this.setState({[event.target.getAttribute('color')]: event.target.value});
    // Send a POST request
    axios.post('/api/hue', {
      brightness:  this.state.brightness,
      red:  this.state.red,
      green:  this.state.green,
      blue:  this.state.blue,
      id: this.props.lightID,
    })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  };



render() {
    return (
      <Row>
      <Col>
      {this.state.lights.map( (light, i) =>
        <div key={i}>
        <HueColour name={light.name} lightId={light.id} type={light.type}/>
        </div>
        )
      }
      </Col>
        </Row>
    );
  }
}

export default HueContainer;
