import React, { Component } from "react";
// import "./../App.css";
class Header extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-6">
          <div className="visualize detection">
            <button className="btn btn-primary">Visualize</button>
            <button className="btn btn-warning">Detection organ human</button>
          </div>
        </div>
        <div className="col-md-6">
          <div className="GradCAM text-center">
            <button className="btn btn-danger">GradCAM</button>
          </div>
        </div>
      </div>
    );
  }
}
export default Header;
