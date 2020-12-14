import React, { Component } from "react";
class Form extends Component {
  render() {
    return (
      <form className="md-form">
        <div className="file-field">
          <div className="btn btn-primary btn-sm float-left waves-effect">
            <span>Choose file</span>
            <input type="file" id="file-input" />
          </div>
          <div className="file-path-wrapper">
            <input
              className="file-path validate"
              type="text"
              placeholder="Link folder Detection"
              id="file-text"
            />
          </div>
        </div>
      </form>
    );
  }
}
export default Form;
