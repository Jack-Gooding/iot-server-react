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
      for (let i = response.data.length-1; i > 0; i--)  {
          newData.push([response.data[i].datetime,response.data[i].temperature,response.data[i].humidity]);
          averageTemp += response.data[i].temperature;
          averageHumidity += response.data[i].humidity;
      }
      averageTemp = averageTemp/response.data.length;
      averageHumidity = averageHumidity/response.data.length;

      this.setState({
        averageTemp: averageTemp.toFixed(1),
        averageHumidity: averageHumidity.toFixed(1),
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
        <p>Temperature: {this.state.averageTemp}°C</p>
        <p>Humidity: {this.state.averageHumidity}%</p>
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
