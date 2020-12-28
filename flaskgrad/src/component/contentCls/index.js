import React, { Component } from "react";
import FrameHead from "../Frame/FrameHead";
import FrameShoulder from "../Frame/FrameShoulder";
import FramePelvis from "../Frame/FramePelvis";
import FrameHip from "../Frame/FrameHip";
import Header from "../header";

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
   Classification = () => {
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
        console.log(data);
        this.setState({
          data: data
        });
      });
  };
  render() {
    let { data } = this.state;
    console.log(data);
    return (
      <div id="content-wrapper" className="d-flex flex-column">
        {/* Main Content */}
        <div id="content">
          {/* Topbar */}
          <Header />
          {/* End of Topbar */}
          {/* Begin Page Content */}
          <div className="container-fluid">
            {/* Page Heading */}
            <div className="row">
              {/* Area Chart */}
              <div className="col-xl-12 col-lg-12">
                <div className="card shadow mb-4">
                  {/* Card Header - Dropdown */}
                  <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">
                      Classification
                    </h6>
                  </div>
                  {/* Card Body */}
                  <div className="card-body">
                    <button
                      className="btn btn-primary"
                      onClick={this.Classification}
                    >
                      Classification
                    </button>
                    <div className="row">
                      <FrameHead data={data} />
                      <FrameShoulder data={data} />
                    </div>
                    <div className="row">
                      <FrameHip data={data} />
                      <FramePelvis data={data} />
                    </div>
                  </div>
                </div>
              </div>
              {/* Pie Chart */}
            </div>
            {/* Content Row */}
          </div>
          {/* /.container-fluid */}
        </div>
        {/* End of Main Content */}
        {/* Footer */}
        <footer className="sticky-footer bg-white">
          <div className="container my-auto">
            <div className="copyright text-center my-auto">
              <span>Bang Anh Nguyen - B1606777</span>
              <span>Linh Chi Nguyen - B1606960</span>
            </div>
          </div>
        </footer>
        {/* End of Footer */}
      </div>
    );
  }
}

export default Content;
