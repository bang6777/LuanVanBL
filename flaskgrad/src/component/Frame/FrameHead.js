import React, { Component } from "react";
export default class FrameHead extends Component {
  render() {
    let { data } = this.props;

    return (
      <div className="col-xl-6 ">
        <h3>Head</h3>
        <div className="chart-area border border-dark frame">
          {this.showImgHead(data)}
        </div>
      </div>
    );
  }
  showImgHead(data) {
    let result = null;
    console.log(data)
    if (data.head == null) {
      console.log("hello");
      result = null;
    } else {
      result = data.head.map(function(h, index) {
        console.log("dasha", h);
        var url = "/img/output/jpg/" + h;
        return <img className="imgCls" key={index} src={url} />;
      });
    }
    return result;
  }
}
