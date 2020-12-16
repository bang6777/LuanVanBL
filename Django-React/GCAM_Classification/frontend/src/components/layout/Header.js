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
  ClsClick = () => {
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
        // console.log(data);
      });
  };
  render() {
    let { item } = this.state;
    console.log(item);
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
              <button onClick={this.ClsClick}>ClsClick</button>
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
