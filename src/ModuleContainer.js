import React, { Component } from 'react';
import {Collapse, Row, Col} from 'reactstrap';

import './ModuleContainer.css';

export class ModuleContainer extends Component {


  componentWillMount() {
  }
    constructor(props) {
    super(props);
    this.state = { collapse: true };

    this.toggle = this.toggle.bind(this);
  }


  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }



render() {
    return (
      <Row className="ModuleContainer">
      <Col>
        <Row style={{marginRight: 0, paddingRight: 0, justifyContent: "flex-start"}}>
        <h4 style={{textDecoration: "underline", cursor: "pointer",}} onClick={this.toggle}>{this.props.title}</h4>

        </Row>
        <Collapse isOpen={this.state.collapse}>
        <Row>
        <Col>
        {this.props.children }
        </Col>
        </Row>
        </Collapse>
      </Col>
        </Row>
    );
  }
}

export default ModuleContainer;
