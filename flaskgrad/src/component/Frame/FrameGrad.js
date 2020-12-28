import React, { Component } from "react";
// import { ImageGroup, Image } from "react-fullscreen-image";
export default class FrameGrad extends Component {
  render() {
    let { data } = this.props;

    return (
      <div className="col-xl-12 ">
        <h3>GradCam Image</h3>
        <div className="chart-area border border-dark frame">
          {this.showImgGrad(data)}
        </div>
      </div>
    );
  }
  showImgGrad(data) {
    let result = null;

    if (data.head_grad !== undefined) {
      console.log("head");
      result = data.head.map(function(h, index) {
        console.log("dasha", h);
        var url = "/img/output/jpg/" + h;
        return <img className="imgCls" key={index} src={url} />;
      });
    }
    if (data.shoulder_grad !== undefined) {
      console.log("shoulder");
      result = data.shoulder.map(function(h, index) {
        console.log("dasha", h);
        var url = "/img/output/jpg/" + h;
        return <img className="imgCls" key={index} src={url} />;
      });
    }
    if (data.hip_grad !== undefined) {
      console.log("hip");
      result = data.hip.map(function(h, index) {
        console.log("dasha", h);
        var url = "/img/output/jpg/" + h;
        return <img className="imgCls" key={index} src={url} />;
      });
    }
    if (data.pelvis_grad !== undefined) {
      console.log("pelvis");
      result = data.pelvis.map(function(h, index) {
        console.log("dasha", h);

        var url = "/img/output/jpg/" + h;
        return <img className="imgCls" key={index} src={url} />;
        // var ar = [];
        // ar[index] = url;

        // return (
        //   <ImageGroup>
        //     <ul className="images">
        //       {ar.map(i => (
        //         <li key={i}>
        //           <Image
        //             src={i}
        //             alt="nature"
        //             className="imgCls"
        //           />
        //         </li>
        //       ))}
        //     </ul>
        //   </ImageGroup>
        // );
      });
    }

    // console.log(data.cars.length);

    return result;
  }
}
