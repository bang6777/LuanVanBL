import React, { Component } from "react";
export default class Frame3 extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { data } = this.props;
    return (
      <div className="col-md-3">
        <div className="class-title text-center">Hip</div>
        <div className="frame">{data.hip}</div>
      </div>
    );
  }
}
