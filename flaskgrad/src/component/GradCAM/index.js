import React, { Component } from "react";
import FrameGrad from "../Frame/FrameGrad";

import Header from "../header";
import Sidebar from "../sidebar/sidebar";
class GradCAM extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  GradCAM = () => {
    fetch("/GradCAM")
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
          data: data
        });
      });
  };
  render() {
    let { data } = this.state;
    console.log(data);
    return (
      <div id="wrapper">
        <Sidebar />

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
                        GradCAM
                      </h6>
                    </div>
                    {/* Card Body */}
                    <div className="card-body">
                      <button className="btn btn-danger" onClick={this.GradCAM}>
                        GradCAM
                      </button>
                      <div className="row">
                        <FrameGrad data={data} />
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
      </div>
    );
  }
}

export default GradCAM;
