import React, { Component } from 'react';
import {Row, Col } from 'reactstrap';
import Slider from './Slider';

import './TPLink.css';
const axios = require('axios');

export class TPLink extends Component {

  constructor(props) {
    super(props);
    this.state = {
      plugs: [{
        name:  "3D Printer",
        on: true,
        ip: 0,
      },
      {
        name:  "Desk Fan",
        on: false,
        ip: 0,
      }],
    };
    this.handleChange = this.handleChange.bind(this);//This is needed because getHueData uses the 'this' keyword

  };

  updateState(data) {
    let plugArray = [];
    console.log("updating");
    data.data.forEach(plugs => {
      plugArray.push({
        name:  plugs.name,
        on: plugs.on,
        ip: plugs.ip,
      })
    });
    console.log(plugArray);
    console.log(this.state.plugs);
    this.setState({plugs: plugArray,});
  }

  componentWillMount() {
    axios.get('/api/tplink')
      .then(response => {
      console.log(response.data);
      this.updateState(response);
      })
    .catch(error => {
      console.log(error);
    });
  }

  handleChange(event) {
    let index = event.target.getAttribute('index');

    axios.post('/api/tplink', {
      name:  this.state.plugs[index].name,
      on: this.state.plugs[index].on,
      ip: this.state.plugs[index].ip,
      index: index,
    })
  .then(response => {
    console.log(response.data);
    this.updateState(response);
  })
  .catch(error => {
    console.log(error);
  });
  }


render() {

  const pStyle = {
};

  const smartPlugs = this.state.plugs.map((plug, i) =>
  <Col xs="12" sm="6" className="plug" key={i}>
    <Row>
      <Col xs="12" sm="6" className="tplink-name">
        <p style={pStyle}>{plug.name}</p>
      </Col>
      <Col xs="12" sm="6" lg="4">
        <Slider type="range" min="0" max="1"  onChange={this.handleChange} datapower={this.state.plugs[i].on} value={this.state.plugs[i].on ? 1 : 0} index={i}/>
      </Col>

    </Row>
  </Col>

);
    return (
      <div >
      <Row>
        {smartPlugs}
        </Row>
        </div>
    );
  }
}

export default TPLink;
