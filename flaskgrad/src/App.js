import React from "react";
// import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Main from "./component/Main";
import GradCAM from "./component/GradCAM";
// import MainGrad from "./component/MainGrad";
function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/GradCAM" component={GradCAM} />
        </Switch>
      </div>
    </Router>
  );
}
export default App;
