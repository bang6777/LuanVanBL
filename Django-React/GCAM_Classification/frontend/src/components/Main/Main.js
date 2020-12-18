import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import "./layout/Header";
import Frame1 from "../Frame/Frame1";
import Frame2 from "../Frame/Frame2";
import Frame3 from "../Frame/Frame3";
import Frame4 from "../Frame/Frame4";
import Frame5 from "../Frame/Frame5";
import Header from "./../layout/Header";
import Form from "./../layout/Form";
import Gradcam from "./../layout/GradCam";
// import "./App.css";
export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  onClickSubmit = item => {
    this.setState({
      data: item
    });
  };
  render() {
    let { data } = this.state;
    console.log(this.state.data);
    return (
      <div className="container">
        <div className="row">
          <div className="panel panel-success">
            <div className="panel-heading">
              <h3 className="panel-title text-center ">
                Visualize and detection organ human with GradCam
              </h3>
            </div>
          </div>
        </div>
        <Header onClickSubmit={this.onClickSubmit} />
        <div className="frame-videos">
          <div className="row border-frame">
            <Frame1 data={this.state.data} />
            <Frame2 />
          </div>
          <div className="row border-frame">
            <Frame3 data={this.state.data} />
            <Frame4 />
          </div>
        </div>
      </div>
    );
  }
}
