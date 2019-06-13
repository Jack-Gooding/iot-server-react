import React, { Component } from 'react';
import {Row, Col} from 'reactstrap';
import Graph from './Graph';
import './App.css';
const axios = require('axios');

export class DoorSensor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      averageTemp: "--",
      totalCount: "--",
      averageCount: "--",
      averageInterval: "--",
      temperature: "--",
      humidity: "--",
      dates: []
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
    axios.get('/doorlatch')
    .then(response => {
      console.log(response.data);
      let dates = [{}];
      let hours = [];
      let intervals = [{}];
      for (let j = 0; j < 24; j++) {
        hours.push({hour:j, count:0});
      }
      let count = 0;
      let totalCount = 0;
      let averageCount = 0;
      let averageInterval = 0;
      let inc = 0;
        for (let i = 0; i < response.data.length; i++)  {
          let time = response.data[i].datetime.split(" ")[1].split(":");
          let timeSec = parseInt(time[0])*60*60+parseInt(time[1])*60+parseInt(time[2]);
          let date = response.data[i].datetime.split(" ")[0].split("-").join("/");

          if (response.data[i].openState === "opened") {
            totalCount += 1;
          }

          for (let j = 0; j < dates.length; j++) {
            if (date !== dates[j].date) {
              let count = 0;
              if (response.data[i].openState === "opened") {
                count = 1;
              }
              dates[j] = {date:date, count: count};
            } else if (date === dates[j].date && response.data[i].openState === "opened") {
              dates[j].count +=1;
            }
          }
          for (let j = 0; j < 24; j++) {
            if (j == time[1]) {
                hours[j].count++;
            }
          }

          for (let j = 0; j < totalCount; j++) {
            if (intervals.length < totalCount) {
              intervals.push({});
            }
            if (response.data[i].openState === "opened") {
              intervals[totalCount-1].tOpen = timeSec;
            } else if (response.data[i].openState === "closed") {
              intervals[totalCount-1].tClosed = timeSec;
            }
          }


      }

      console.log(intervals);
      console.log(hours);




      for (let i = 0; i < intervals.length; i++) {
        if (intervals[i].tClosed && intervals[i].tOpen) {
          averageInterval += intervals[i].tClosed - intervals[i].tOpen;
        }
      }
      averageCount = totalCount / dates.length;
      averageCount = Math.round(averageCount*100)/100;
      averageInterval = averageInterval / intervals.length;
      averageInterval = Math.round(averageInterval*100)/100;

      this.setState({
        dates: dates,
        totalCount: totalCount,
        averageCount: averageCount,
        averageInterval: averageInterval,
      })
      console.log(this.state.dates);
    });
  };

deleteTable(event) {
  axios.get('/doorlatchdelete')
  .then(response => {
    console.log(response.data);
  })
}

render() {
    return (
      <div>
        <Row>
        <p style={{paddingLeft: "15px"}}>Location: {this.state.location}</p>
        </Row>
        <Row>
        <Col>
        <p>Avg Opens/day: {this.state.averageCount}</p>
        <p>Avg Time Open/s: {this.state.averageInterval}s</p>
        </Col>
        <Col>
        <p>Total Opens: {this.state.totalCount}</p>
        <p>Current Humidity: {this.state.humidity}%</p>
        </Col>
        </Row>
        <button onClick={this.deleteTable}>delete table</button>
        <Row>
        </Row>
        </div>
    );
  }
}

export default DoorSensor;
