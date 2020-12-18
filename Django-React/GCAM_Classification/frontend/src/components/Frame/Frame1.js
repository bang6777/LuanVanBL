import React, { Component } from "react";
export default class Frame1 extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  render() {
    let { data } = this.props;

    return (
      <div className="col-md-6">
        <div className="class-title text-center">Head</div>
        <div className="frame">{this.showImgHead(data)}</div>
      </div>
    );
  }
  showImgHead(data) {
    let result = null;
    if (data.head == null) {
      result = null;
    } else {
      result = data.head.map(function (h, index) {
        console.log("dasha", h);
        return <img key={index} src={"/static/output/jpg/" + h}></img>;
      });
    }
    return result;
  }
}
