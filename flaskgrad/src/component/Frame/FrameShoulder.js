import React, { Component } from "react";
export default class FrameShoulder extends Component {
  render() {
    let { data } = this.props;

    return (
      <div className="col-xl-6 ">
        <h3>Shoulder</h3>
        <div className="chart-area border border-dark frame">
          {this.showImgShoulder(data)}
        </div>
      </div>
    );
  }
  showImgShoulder(data) {
    let result = null;
    if (data.shoulder == null) {
      console.log("hello");
      result = null;
    } else {
      result = data.shoulder.map(function(h, index) {
        console.log("dasha", h);
        var url = "/img/output/jpg/" + h;
        return <img className="imgCls" key={index} src={url} />;
      });
    }
    return result;
  }
}
