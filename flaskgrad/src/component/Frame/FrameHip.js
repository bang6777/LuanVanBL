import React, { Component } from "react";
export default class FrameHip extends Component {
  render() {
    let { data } = this.props;

    return (
      <div className="col-xl-6 ">
        <h3>Hip</h3>
        <div className="chart-area border border-dark frame">
          {this.showImgHip(data)}
        </div>
      </div>
    );
  }
  showImgHip(data) {
    let result = null;
    if (data.hip == null) {
      console.log("hello");
      result = null;
    } else {
      result = data.hip.map(function(h, index) {
        console.log("dasha", h);
        var url = "/img/output/jpg/" + h;
        return <img className="imgCls" key={index} src={url} />;
      });
    }
    return result;
  }
}
