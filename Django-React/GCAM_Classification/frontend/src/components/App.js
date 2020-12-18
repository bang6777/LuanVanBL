import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./layout/Header";
import Main from "./Main/Main";
import Main1 from "./Main1/Main1";

// import "./App.css";
class App extends Component {
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
  render() {
    return (
      // <Main></Main>
      <Router>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/ClsClick" component={Main} />
          <Route path="/GradCamUI" component={Main1} />
          <Route path="/GradCAMClick" component={Main1} />
        </Switch>
      </Router>
    );
  }
}
ReactDOM.render(<App />, document.getElementById("app"));
