import React, { Component } from "react";
export default class Frame2 extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let { data } = this.props;
    return (
      <div className="col-md-6">
        <div className="class-title text-center">Shoulder</div>
        <div className="frame">{this.showImgShoulder(data)}</div>
      </div>
    );
  }
  showImgShoulder(data){
      let result=null;
      if( data.shoulder == null){
        result = null
      }else{
        result=data.shoulder.map(function (h, index) {
          console.log("dasha", h);
          return <img key={index} src={"/static/output/jpg/" + h}></img>;
        });
      }
      return result;
  }
}
