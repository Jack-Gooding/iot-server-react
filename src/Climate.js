import React, { Component } from 'react';
import {Row, Col} from 'reactstrap';
import Graph from './Graph';
import './App.css';
const axios = require('axios');

export class Climate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      averageTemp: "--",
      averageHumidity: "--",
      temperature: "--",
      humidity: "--",
      data: [["Date/Time","Temperature","Humidity"],],
    };
  };


  componentWillMount() {
    //this is clientside requesting data from API
    /*axios.get('http://192.168.1.251/climate'
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
    });*/
    //this is serverside requesting data from API
    axios.get('/climate')
    .then(response => {
      console.log(response.data);
      let newData = this.state.data;
      let averageTemp = 0;
      let averageHumidity = 0;
      let temperature;
      let humidity;
      for (let i = response.data.length-1; i > 0; i--)  {
          newData.push([response.data[i].datetime,response.data[i].temperature,response.data[i].humidity]);
          averageTemp += response.data[i].temperature;
          averageHumidity += response.data[i].humidity;
          if (i === 1) {
            temperature = response.data[i].temperature;
            humidity = response.data[i].humidity;
          }
      }
      averageTemp = averageTemp/response.data.length;
      averageHumidity = averageHumidity/response.data.length;

      this.setState({
        averageTemp: averageTemp.toFixed(1),
        averageHumidity: averageHumidity.toFixed(1),
        temperature: temperature,
        humidity: humidity,
        data: newData,
      })
      console.log(this.state.data);
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
        <p>Avg Temperature: {this.state.averageTemp}°C</p>
        <p>Avg Humidity: {this.state.averageHumidity}%</p>
        </Col>
        <Col>
        <p>Current Temperature: {this.state.temperature}°C</p>
        <p>Current Humidity: {this.state.humidity}%</p>
        </Col>
        </Row>
        <Row>
        <Graph data={this.state.data}/>
        </Row>
        </div>
    );
  }
}

export default Climate;
