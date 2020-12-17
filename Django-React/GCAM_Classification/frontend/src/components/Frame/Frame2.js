import React, { Component } from "react";
export default class Frame2 extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { data } = this.props;
    return (
      <div className="col-md-3">
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
        result=data.shoulder.map(grade=>{
          console.log("dasha",grade)
          return(
            <img src = {grade}></img>

          )
          })
      }
      return result;
  }
}
