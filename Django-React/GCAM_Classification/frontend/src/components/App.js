import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import "./layout/Header";
import Header from "./layout/Header";

class App extends Component {
  render() {
    return <Header />;
  }
}
ReactDOM.render(<App />, document.getElementById("app"));

