import React, { Component } from "react";
class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: "",
      linkName: ""
    };
  }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  handleChangeFile = e => {
    this.setState({
      link: e.target.files[0]
    });
  };
  render() {
    let { link } = this.state;

    return (
      <form className="md-form">
        <div className="file-field">
          <div className="btn btn-primary btn-sm float-left waves-effect">
            <span>Choose file</span>
            <input
              type="file"
              id="file-input"
              onChange={this.handleChangeFile}
              // webkitdirectory=""
              // directory=""
              multiple
            />
          </div>
          <div className="file-path-wrapper">
            <input
              value={this.state.link}
              className="file-path validate"
              type="text"
              placeholder="Link folder Detection"
              id="file-text"

              // multiple
            />
          </div>
        </div>
      </form>
    );
  }
}
export default Form;
