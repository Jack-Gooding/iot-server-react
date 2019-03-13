import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import './App.css';
const axios = require('axios');


export class RefreshIcon extends Component {


    iconStyle() {
      return {
        cursor: 'pointer',
        textAlign: "center",
        verticalAlign: "bottom",
        display: "inline-block",
        transform: "translateX(-8%) translateY(8%)"
      }
    }

    getStyle() {
      return {
        background: this.props.onState === "on" ? 'green' : 'red',
        width: "3.5em",
        height: "3.5em",
        borderRadius: "3.5em",
        border: "solid 2px black",
        textAlign: "center",
        margin: "auto",
        verticalAlign: "middle",
      }
    }

    iconStyle2() {
      return {

      }
    }

    refreshAPI() {
      axios.get('/api/refresh')
        .then(response => {
        console.log(response.data);
        })
      .catch(error => {
        console.log(error);
      });
    }



render() {

    let style = {
      background: "white",
      padding: "10px",
      border: "solid 1px black",
      borderRadius: "10px",

    };
    return (
      <div className="RefreshIcon" style={style} onClick={this.refreshAPI}>
      <span className="fa-layers fa-fw" >
<FontAwesomeIcon icon={faSyncAlt} />
</span>
      </div>
    );
  }
}

export default RefreshIcon;
