import React, { Component } from 'react';
import {Row, Col} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faCircle as farCircle } from '@fortawesome/fontawesome-free-regular'
import './App.css';
const axios = require('axios');


export class PowerIndicator extends Component {

  constructor(props) {
    super(props);
    this.props.update.bind(this)
  };

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


render() {
    return (
      <div onClick={this.props.update}>
      <span className="fa-layers fa-fw" >
<FontAwesomeIcon icon={farCircle} color="green" size="2x" />
<FontAwesomeIcon icon="power-off" />
</span>
      </div>
    );
  }
}

export default PowerIndicator;
