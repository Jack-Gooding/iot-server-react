import React, { Component } from 'react';
import {Row, Col} from 'reactstrap';
import './sliders.css'
const axios = require('axios');

export class HueColour extends Component {

  constructor(props) {
    super(props);
    this.state = {
      brightness: 0,
      red: 0,
      green: 0,
      blue: 0,
      id: 0,
      on: false,
    };

    this.handleSlider = this.handleSlider.bind(this); //This is needed because getHueData uses the 'this' keyword
  };

  componentDidMount() {
    if (this.props.lightId) {
      axios.get('/api/huelight/'+this.props.lightId)
      .then(response => {
        //console.log(response.data);
        let rgb = response.data.rgb;
        //console.log(rgb);
        rgb = rgb.split('rgb(')[1].split(')')[0].split(',');
        this.setState({
          brightness: response.data.brightness,
          red: rgb[0],
          green: rgb[1],
          blue: rgb[2],
          id: response.data.id,
          on: response.data.on,
        });
      })
      .catch(error => {
        console.log(error);
      });
    }
    }

componentWillReceiveProps(nextProps) {

}

  handleSlider(event) {
    this.setState({[event.target.getAttribute('color')]: event.target.value});
    // Send a POST request
    axios.post('/api/hue', {
      brightness:  this.state.brightness,
      red:  this.state.red,
      green:  this.state.green,
      blue:  this.state.blue,
      id: this.props.lightId,
    })
    .then(response => {
      //console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  };



render() {
  let checkType; //Checks to see if the light is capable of colour changing. Adds three sliders if so.
  if (this.props.type === "Extended color light") {
    checkType = <Col sm="9">
                    <Row>
                    <Col sm="8">
                      <input style={{width: "100%", }} type="range" min="0" max="255" color="red" value={this.state.red} onChange={this.handleSlider}/>
                      <input style={{width: "100%", }} type="range" min="0" max="255" color="green" value={this.state.green} onChange={this.handleSlider}/>
                      <input style={{width: "100%", }} type="range" min="0" max="255" color="blue" value={this.state.blue} onChange={this.handleSlider}/>
                    </Col>
                    <Col sm="4" className="hueSwatch" style={ { background: `rgb(${ this.state.red },${ this.state.green },${ this.state.blue })`, } }>
                    </Col>
                    </Row>
                  </Col>;
  };
    return (
      <Row style={{margin: "10px"}}>
        <Col sm="2">
        <p>
        {this.props.name}<br/>
        On: {this.state.on? 'on' : 'off'}
        </p>
        </Col>
        <Col sm="1">
        <input type="range" style={{ height: "75px"}} min="0" max="100" color="brightness" orient="vertical" value={this.state.brightness} onChange={this.handleSlider}/>
        </Col>
        {checkType}
        </Row>
    );
  }
}

export default HueColour;
