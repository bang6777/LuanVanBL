import React, { Component } from "react";
export default class Frame4 extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  render() {
    let { data } = this.props;
    return (
      <div className="col-md-6">
        <div className="class-title text-center">Pelvis</div>
        <div className="frame">{this.showImgPelvis(data)}</div>
      </div>
    );
  }
  showImgPelvis(data) {
    let result = null;
    if (data.pelvis == null) {
      result = null;
    } else {
      result = data.pelvis.map(function (h, index) {
        console.log("dasha", h);
        return <img key={index} src={"/static/output/jpg/" + h}></img>;
      });
    }
    return result;
  }
}
