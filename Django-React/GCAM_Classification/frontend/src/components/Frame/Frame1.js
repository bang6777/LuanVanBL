import React, { Component } from "react";
export default class Frame1 extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { data } = this.props;
    return (
      <div className="col-md-3">
        <div className="class-title text-center">Head</div>
        <div className="frame">{this.showImg(data)}</div>
      </div>
    );
  }
  showImg(data){
      let result=null;
      if( data.head == null){
        result = null
      }else{
        result=data.head.map(grade=>{
          console.log("dasha",grade)
          return(
            <img src = {grade}></img>
          )
          })
      }
      return result;
  }
}
