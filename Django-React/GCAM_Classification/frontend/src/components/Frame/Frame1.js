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
    let resultscore = null;
    let result_img =null
    if (data.head == null & data.accuaracy_head==null) {
      result = null;
    } else {
      resultscore = data.accuaracy_head.map(function (h, index) {
        console.log("dasha", h);
        return 
        <div>
          <h1>{h}</h1>
          </div>;
      });
      result_img = data.head.map(function (h, index) {
        console.log("dasha", h);
        return 
        <div>
          <img key={index} src={"/static/output/jpg/" + h}></img>
          </div>;
      });
      result = resultscore+result_img;
      console.log("result", result);
    }
    return result;
  }
}
