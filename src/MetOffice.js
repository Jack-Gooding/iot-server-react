import React, { Component } from 'react';
import {Button,ButtonGroup, Row, Col } from 'reactstrap';
import './App.css';
const axios = require('axios');

export class MetOffice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      days: [
        {date:"12-31-123",times:[{
              time: 35,
              temperature: "--",
              humidity: "--",
              precipitation: "--",
              type: "--",
              windDirection: "--",
              windSpeed: "--"},{}],},
        {date:"12-31-123",times:[{},{}],},
        {date:"12-31-123",times:[{},{}],},
        {date:"12-31-123",times:[{},{}],},

        ],
        currentDate: 0,
        currentTime: 0,

    };

    this.changeTime = this.changeTime.bind(this); //This is needed because getHueData uses the 'this' keyword
    this.changeDate = this.changeDate.bind(this); //This is needed because getHueData uses the 'this' keyword
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

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
      let dataArray = [];
      console.log(data);
      data.forEach((date, i) => {
        let timeArray = [];

        //console.log(date.value.split('-')[2].split('Z')[0]);
        //console.log(`Today: ${now.getDate().toString()}`);
        if(date.value.split('-')[2].split('Z')[0] === now.getDate().toString()) {
          this.setState({
            currentDate: i,
          })
          console.log(date.value.split('-')[2].split('Z')[0]);
        }
          date.Rep.forEach((time, j) => {
            //console.log(((now.getHours() * 60) - time["$"]));
            if((now.getHours() * 60) - time["$"] < 300 && (now.getHours() * 60) >= time["$"]) {
              this.setState({
                currentTime: 0,
              })
            //console.log(`j: ${j}-(7-${date.Rep.length})`)
            }
            timeArray.push({
              time: time["$"]/60,
              temperature: time["T"],
              humidity: time["H"],
              precipitation: time["Pp"],
              type: types[time["W"]],
              windDirection: time["D"],
              windSpeed: time["S"]
          });
        });
        //console.log(timeArray);

        date.times = timeArray[i];
        dataArray.push({
          date: date.value.split('-')[2].split('Z')[0],
          times: timeArray,
        });
      })

      //console.log(dataArray);
    this.setState({
      days: dataArray,
    })
    })
    .catch(error => {
      console.log(error);
    });

    }

changeTime(event) {
  this.setState({ currentTime: event.target.getAttribute('index') });
}

changeDate(event) {
  this.setState({ currentDate: event.target.getAttribute('index') });
}

onRadioBtnClick(rSelected) {
  this.setState({ rSelected });
}

render() {
    return (
      <div>
        <Row>
        <Col>
        <ButtonGroup style={{display: "flex", margin: "10px 0"}}>
        {this.state.days.map((day, i) =>
          <Button color="primary" size="lg" key={i} index={i} onClick={this.changeDate} active={this.state.currentDate === i} style={{padding: `0 15px`, flex: "1"}}>
          {day.date}{parseInt(day.date.split("")[1]) > 3  ? "th" : (parseInt(day.date.split("")[1]) === 1 ? "st" : (parseInt(day.date.split("")[1]) === 2 ? "nd" : "rd")) }
            </Button>
          )
        }
        </ButtonGroup>
        </Col>
        </Row>
        <Row>
        <Col>
        <ButtonGroup style={{display: "flex",}}>
        {this.state.days[this.state.currentDate].times.map((time, j) =>
          <Button key={j} index={j} onClick={this.changeTime} active={this.state.currentTime === j} style={{display: `inline-block`, padding: `0 15px`, flex: "1"}}>{time.time}:00</Button>
        )}
        </ButtonGroup>
        </Col>
        </Row>

        <Row style={{marginTop: "15px"}}>
        <Col>
        <p>Temperature: {this.state.days[this.state.currentDate].times[this.state.currentTime].temperature}°C</p>
        </Col>
        <Col>
        <p>Precipitation: {this.state.days[this.state.currentDate].times[this.state.currentTime].precipitation}%</p>
        </Col>
        <Col>
        <p>Wind Direction: {this.state.days[this.state.currentDate].times[this.state.currentTime].windDirection}</p>
        </Col>
        </Row>
        <Row>
        <Col>
        <p>Humidity: {this.state.days[this.state.currentDate].times[this.state.currentTime].humidity}%</p>
        </Col>
        <Col>
        <p>Weather Type: {this.state.days[this.state.currentDate].times[this.state.currentTime].type}</p>
        </Col>
        <Col>
        <p>Wind Speed: {this.state.days[this.state.currentDate].times[this.state.currentTime].windSpeed}mph</p>
        </Col>
        </Row>
        </div>
    );
  }
}

export default MetOffice;
