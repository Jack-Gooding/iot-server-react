import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {ModuleContainer} from './ModuleContainer';
import {HueContainer} from './HueContainer';
import {HueContainer2} from './HueContainer2';
import {TPLink} from './TPLink';
import {Climate} from './Climate';
import {MetOffice} from './MetOffice';
import { Container} from 'reactstrap';
import {WS2812B} from './WS2812B';
import {ScreenLights} from './ScreenLights';


import {Stepper} from './Stepper';

const axios = require('axios');



class App extends Component {

  constructor() {
    super();
    this.state = {
      backgroundImg: "",
    }
  }
  componentWillMount() {
    axios.get(`https://api.nasa.gov/planetary/apod?date=2018-12-09&api_key=DEMO_KEY`, { //https://api.nasa.gov/api.html#apod
    })
  .then(response => {
    console.log(response.data);
    this.setState({
      backgroundImg: response.data.url,
    })

  })
  .catch(error => {
    console.log(error);
  });
  }


render() {
//  <ModuleContainer title="Philips Hue">
  //<HueContainer/>
  //</ModuleContainer>
    return (
      <div className="App" style={{backgroundImage: `url(${this.state.backgroundImg})`, paddingTop: "25px"}}>
      <Container>
        <ModuleContainer title="Phillips Hue 2">
          <HueContainer2/>
        </ModuleContainer>

        <ModuleContainer title="TP-Link">
          <TPLink/>
        </ModuleContainer>


        <ModuleContainer title="Met Office API">
          <MetOffice/>
        </ModuleContainer>
        <ModuleContainer title="Climate Monitor">
        <Climate/>
        </ModuleContainer>
        <ModuleContainer title="Screen Lights">
          <ScreenLights/>
        </ModuleContainer>
        <ModuleContainer title="WS2812B">
          <WS2812B/>
        </ModuleContainer>
        <ModuleContainer title="Stepper">
          <Stepper/>
        </ModuleContainer>
        </Container>
      </div>
    );
  }
}

export default App;
