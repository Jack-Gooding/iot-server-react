import React, { Component } from 'react';
import { Col } from 'reactstrap';

export class Slider extends Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  };


  handleChange(e) {
    console.log(`props: ${this.props.value}`);
    console.log(`value: ${e.target.value}`);

    if (this.props.value != e.target.value) {
      this.props.onChange(this.props.index, e.target.value);
    } else {
      this.props.onChange(this.props.index, 0);
    }
  }

render() {

    return (
      <div>
        <input className="tplink-slider" type="range" min={this.props.min} max={this.props.max}  onChange={this.handleChange} onDoubleClick={this.handleChange} value={this.props.value}/>
      </div>
    );
  }
}

export default Slider;