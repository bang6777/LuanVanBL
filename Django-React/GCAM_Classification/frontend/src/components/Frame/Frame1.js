import React, { Component } from "react";
export default class Frame1 extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  render() {
    let { data } = this.props;

    return (
      <div className="col-md-3">
        <div className="class-title text-center">Head</div>
        <div className="frame">{this.showImg(data)}</div>
      </div>
    );
  }
  showImg(data) {
    console.log("111111");
    console.log(data);

    let result = null;
    if (data.name.length > 0) {
      result = data.name.map((dt, index) => {
        return { dt };
      });
    }
  }
}
