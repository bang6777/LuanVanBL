import React, { Component } from "react";
export default class Frame3 extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { data } = this.props;
    return (
      <div className="col-md-6">
        <div className="class-title text-center">Hip</div>
        <div className="frame">{this.showImgHip(data)}</div>
      </div>
    );
  }
  showImgHip(data){
      let result=null;
      if( data.hip == null){
        result = null
      }else{
        result=data.hip.map(grade=>{
          console.log("dasha",grade)
          return(
            <img  src = {grade}></img>

          )
          })
      }
      return result;
  }
}
