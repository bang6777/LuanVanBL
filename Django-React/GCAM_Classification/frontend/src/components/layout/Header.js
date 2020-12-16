import React, { Component } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
class Header extends Component {
  constructor(props) {
    super(props);
    // this.routeChange = this.routeChange.bind(this);
    this.state = {
      item: [],
      placeholder: ""
    };
    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleCLick = () => {
    let item = {
      ID: 1
    };
    this.props.onClickSubmit(item);
  };

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
          <div className="col-md-6">
            <div className="GradCAM text-center">
              <button className="btn btn-primary">
                <Link to="/ClsClick">ClassClick</Link>
              </button>
            </div>
          </div>
          <div className="col-md-2">
            <div className="Cls text-center">
              <button className="btn btn-danger" onClick={this.handleCLick}>
                GradCAM
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Header;
