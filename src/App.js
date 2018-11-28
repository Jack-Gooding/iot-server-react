import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {ModuleContainer} from './ModuleContainer';
import {HueContainer} from './HueContainer';
import {TPLink} from './TPLink';
import {Climate} from './Climate';
import {MetOffice} from './MetOffice';
import { Container} from 'reactstrap';
import {WS2812B} from './WS2812B';

import {Stepper} from './Stepper';




class App extends Component {

  componentWillMount() {

  }


render() {
    return (
      <div className="App">
      <Container>
        <ModuleContainer title="Philips Hue">
          <HueContainer/>
        </ModuleContainer>

        <ModuleContainer title="TP-Link">
          <TPLink/>
        </ModuleContainer>

        <ModuleContainer title="Climate Monitor">
          <Climate/>
        </ModuleContainer>

        <ModuleContainer title="Met Office API">
          <MetOffice/>
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
