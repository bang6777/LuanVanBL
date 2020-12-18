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
  GradCamUI = item => {
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
        this.setState({
          item: data
        });
        this.props.onClickSubmit1(this.state.item);
      });
  };
  ClsClick = item => {
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
        this.setState({
          item: data
        });
        this.props.onClickSubmit(this.state.item);
      });
  };
  render() {
    let { item } = this.state;

    return (
      <div className="row">
        <div className="col-md-6">
          <div className="visualize detection">
            <button className="btn btn-primary">
              <Link to="/">Classification</Link>
            </button>
            <button className="btn btn-warning">
              <Link to="/GradCamUI" onClick={this.GradCamUI}>
                GradCamUI
              </Link>
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <div className="col-md-2">
            <div className="GradCAM text-center">
              <button className="btn btn-primary" onClick={this.ClsClick}>
                ClsClick
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Header;
