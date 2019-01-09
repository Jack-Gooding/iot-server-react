import React, { Component } from 'react';
import { Col } from 'reactstrap';
import Slider from './Slider';

import './TPLink.css';
const axios = require('axios');

export class TPLink extends Component {

  constructor(props) {
    super(props);
    this.state = {
      plugs: [{
        name:  "3D Printer",
        on: 1,
        ip: 0,
      },
      {
        name:  "Desk Fan",
        on: 0,
        ip: 0,
      }],
    };
    this.handleChange = this.handleChange.bind(this);//This is needed because getHueData uses the 'this' keyword

  };

  updateState(data) {
    let plugArray = [];
    data.data.forEach(plugs => {
      plugArray.push({
        name:  plugs.name,
        on: plugs.on,
        ip: plugs.ip,
        on_time: plugs.on_time,
      })
    });
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

  handleChange(index, newValue) {
    console.log(newValue);
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
    width: "30%",
    display: "block-inline",
};

  const smartPlugs = this.state.plugs.map((plug, i) =>
  <Col className="plug" key={i}>
  <div>
    <p className="tplink-name" style={pStyle}>{plug.name}</p>
    <Slider type="range" min="0" max="1"  onChange={this.handleChange} value={this.state.plugs[i].on} index={i}/>
    <p className="tplink-state" style={pStyle}>{plug.on === 1 ? "On" : "Off"}</p>
    <p>{plug.on_time}</p>
    </div>

    </Col>

);
    return (
      <div className="tplink">
        {smartPlugs}
        </div>
    );
  }
}

export default TPLink;
