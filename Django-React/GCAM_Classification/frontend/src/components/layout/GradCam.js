import React, { Component } from "react";
class Gradcam extends Component {
  render() {
    let { data } = this.props;
    console.log(data);
    return (
      <div className="col-md-12">
        <div className="class-title text-center">Gradcam</div>
        <div className="frameGradCam frame-color">{this.showImgGrad(data)}</div>
      </div>
    );
  }
  showImgGrad(data) {
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
export default Gradcam;
