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
      [e.target.name]: e.target.value,
      link: e.target.files
    });
  };
  render() {
    let { link } = this.state;
    console.log(this.link);
    return (
      <form className="md-form">
        <div className="file-field">
          <div className="btn btn-primary btn-sm float-left waves-effect">
            <span>Choose file</span>
            <input
              type="file"
              id="file-input"
              onChange={this.handleChange}
              // webkitdirectory=""
              // directory=""
              multiple
            />
          </div>
          <div className="file-path-wrapper">
            <input
              value={this.state.link}
              name={this.state.link[4]}
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
