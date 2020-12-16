import React, { Component } from "react";
export default class Frame1 extends Component {
  render() {
    let { data } = this.props;
    console.log(data.ID);
    return (
      <div className="col-md-3">
        <div className="class-title text-center">Head</div>
        <div className="frame">{data.ID}</div>
      </div>
    );
  }
}
