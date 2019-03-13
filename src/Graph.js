import React, { Component } from 'react';
import Chart from 'react-google-charts';

export class Graph extends Component {




  componentWillMount() {
    }



render() {
    return (
      <Chart
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={this.props.data}
        //data={[["date","temp","hum"],[12,13,15]]}
        width="100%"
        height="400px"
        legendToggle
        options={{
          intervals: { style: 'sticks' },
          crosshair: { trigger: 'both' }, // Display crosshairs on focus and selection.
          pointSize: 3,
          dataOpacity: 0.5,
          series: {
            // Gives each series an axis name that matches the Y-axis below.
            0: { axis: 'Temperature', curveType: 'function', },
            1: { axis: 'Humidity', curveType: 'function', },
          },
          axes: {
            // Adds labels to each axis; they don't have to match the axis names.
            y: {
              Temperature: { label: 'Temperature (Celsius)' },
              Humidity: { label: 'Humidity %' },
            },
          },
          }}
        />
    );
  }
}

export default Graph;
