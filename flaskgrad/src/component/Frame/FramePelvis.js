import React, { Component } from "react";
export default class FramePelvis extends Component {
  render() {
    let { data } = this.props;

    return (
      <div className="col-xl-6 ">
        <h3>Pelvis</h3>
        <div className="chart-area border border-dark frame">
          {this.showImgPelvis(data)}
        </div>
      </div>
    );
  }
  showImgPelvis(data) {
    let result = null;
    if (data.pelvis == null) {
      console.log("hello");
      result = null;
    } else {
      result = data.pelvis.map(function(h, index) {
        console.log("dasha", h);
        var url = "/img/output/jpg/" + h;
        return <img className="imgCls" key={index} src={url} />;
      });
    }
    return result;
  }
}
