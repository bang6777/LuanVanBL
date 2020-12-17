import React, { Component } from "react";
export default class Frame2 extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { data } = this.props;
    return (
      <div className="col-md-3">
        <div className="class-title text-center">Shoulder</div>
        <div className="frame">{data.shoulder}</div>
      </div>
    );
  }
}
