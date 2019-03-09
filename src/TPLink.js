import React, { Component } from 'react';
import { Col } from 'reactstrap';
import Slider from './Slider';
import RefreshIcon from './RefreshIcon'

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
    <Slider type="range" min="0" max="1"  onChange={this.handleChange} datapower={this.state.plugs[i].on} value={this.state.plugs[i].on ? 1 : 0} index={i}/>
    <p className="tplink-state" style={pStyle}>{plug.on ? "On" : "Off"}</p>
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
