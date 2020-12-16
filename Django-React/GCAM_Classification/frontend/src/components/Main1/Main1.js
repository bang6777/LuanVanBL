import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
// import "./layout/Header";
import Frame1 from "../Frame/Frame1";
import Frame2 from "../Frame/Frame2";
import Frame3 from "../Frame/Frame3";
import Frame4 from "../Frame/Frame4";
import Frame5 from "../Frame/Frame5";
import Header from "../layout/Header";
import Form from "../layout/Form";
import Gradcam from "../layout/GradCam";
// import "./App.css";
export default class Main1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  handleSubmit = item => {
    this.setState({
      data: item
    });
    console.log(item);
  };
  componentDidMount() {
    fetch("/ClsClick")
      .then(response => {
        if (response.status > 400) {
          return this.setState(() => {
            return { placeholder: "Something went wrong!" };
          });
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
      });
  }
  render() {
    return <div>Hello Hieu</div>;
  }
}
