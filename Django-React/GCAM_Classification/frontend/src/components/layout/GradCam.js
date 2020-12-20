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
    console.log(data.length);
    if (data.head_grad != null) {
      result = data.head_grad.map(function (h, index) {
        console.log("dasha", h);
        return (
          <img
            key={index}
            src={"/static/output_gradcam/jpg/Head/Hip0.jpg"}
          ></img>
        );
      });
    }

    if (data.pelvis_grad != null) {
      result = data.pelvis_grad.map(function (h, index) {
        console.log("dasha", h);
        return (
          <img key={index} src={"/static/output_gradcam/jpg/Pelvis/" + h}></img>
        );
      });
    }
    if (data.shoulder_grad != null) {
      result = data.shoulder_grad.map(function (h, index) {
        console.log("dasha", h);
        return (
          <img
            key={index}
            src={"/static/output_gradcam/jpg/Shoulder/" + h}
          ></img>
        );
      });
    }
    if (data.hip_grad != null) {
      result = data.hip_grad.map(function (h, index) {
        console.log("dasha", h);
        return (
          <img key={index} src={"/static/output_gradcam/jpg/Hip/" + h}></img>
        );
      });
    }

    // console.log(result);
    return result;
  }
}
export default Gradcam;
