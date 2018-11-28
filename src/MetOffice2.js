import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import './App.css';
const axios = require('axios');

export class MetOffice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      temperature: "--",
      humidity: "--",
      precipitation: "--",
      type: "--",
      windDirection: "--",
      windSpeed: "--"
    };
  };


  componentWillMount() {
    const now = new Date();
    const types = { //https://www.metoffice.gov.uk/datapoint/support/documentation/code-definitions
      NA: "Not Available",
      0: "Clear night",
      1: "Sunny day",
      2: "Partly cloudy (night)",
      3: "Partly cloudy (day)",
      4: "Not used",
      5: "Mist",
      6: "Fog",
      7: "Cloudy",
      8: "Overcast",
      9: "Light rain shower (night)",
      10: "Light rain shower (day)",
      11: "Drizzle",
      12: "Light rain",
      13: "Heavy rain shower (night)",
      14: "Heavy rain shower (day)",
      15: "Heavy rain",
      16: "Sleet shower (night)",
      17: "Sleet shower (day)",
      18: "Sleet",
      19: "Hail shower (night)",
      20: "Hail shower (day)",
      21: "Hail",
      22: "Light snow shower (night)",
      23: "Light snow shoower (day)",
      24: "Light snow",
      25: "Heavy snow shower (night)",
      26: "Heavy snow shower (day)",
      27: "Heavy snow",
      28: "Thunder shower (night)",
      29: "Thunder shower (day)",
      39: "Thunder",
    };
    //console.log(now.getHours());
    axios.get('http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/3844?res=3hourly&key=643effbf-f160-4c02-8afb-4fd60421a878'
	)
    .then(response => {
      let data = response.data.SiteRep.DV.Location.Period;
      //console.log(data);
      data.forEach((date, i) => {
        //console.log(date.value.split('-')[2].split('Z')[0]);
        //console.log(`Today: ${now.getDate().toString()}`);
        if(date.value.split('-')[2].split('Z')[0] === now.getDate().toString()) {
          //console.log(`Success: ${date.value.split('-')[2].split('Z')[0]}`);
          date.Rep.forEach((time, i) => {
            //console.log(((now.getHours() * 60) - time["$"]));
            if((now.getHours() * 60) - time["$"] < 300 && (now.getHours() * 60) >= time["$"]) {
              //console.log(now.getHours()*60);

              this.setState({
                temperature: time["T"],
                humidity: time["H"],
                precipitation: time["Pp"],
                type: types[time["W"]],
                windDirection: time["D"],
                windSpeed: time["S"]
            })
            }
          })
        }
      })



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
        <p>Temperature: {this.state.temperature}°C</p>
        </Col>
        <Col>
        <p>Precipitation: {this.state.precipitation}%</p>
        </Col>
        <Col>
        <p>Wind Direction: {this.state.windDirection}</p>
        </Col>
        </Row>
        <Row>
        <Col>
        <p>Humidity: {this.state.humidity}%</p>
        </Col>
        <Col>
        <p>Weather Type: {this.state.type}</p>
        </Col>
        <Col>
        <p>Wind Speed: {this.state.windSpeed}mph</p>
        </Col>
        </Row>
        </div>
    );
  }
}

export default MetOffice;
