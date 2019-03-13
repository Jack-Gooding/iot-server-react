import React, { Component } from 'react';

export class Slider extends Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  };


  handleChange(e) {
    //console.log(`props: ${this.props.value}`);
    console.log(`value: ${e.target.value}`);

    if (this.props.value !== e.target.value) {
      this.props.onChange(e);
      console.log(this.props.value);
      console.log(e.target.value);
    }
    /* else {
      this.props.onChange(this.props.index, 0);
    }*/
  }

render() {

    return (
      <div>
        <input className="tplink-slider" type="range" min={this.props.min} max={this.props.max} datapower={this.props.datapower ? "true" : "false"} onChange={this.handleChange} onDoubleClick={this.handleChange} value={this.props.value} index={this.props.index}/>
      </div>
    );
  }
}

export default Slider;
