import React, { Component } from "react";
export default class Frame4 extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { data } = this.props;
    return (
      <div className="col-md-6">
        <div className="class-title text-center">Pelvis</div>
        <div className="frame"></div>
      </div>
    );
  }
  // showImgPelvis(data){
  //     let result=null;
  //     if( data.pelvis == null){
  //       result = null
  //     }else{
  //       result=data.pelvis.map(grade=>{
  //         console.log("dasha",grade)
  //         return(
  //           <img src = {grade}></img>
  //         )
  //         })
  //     }
  //     return result;
  // }
}
