import React from "react";
import { Link } from "react-router-dom";
import ContentCls from "../contentCls";
// import Main from
function Sidebar() {
  return (
    <ul
      className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
      id="accordionSidebar"
    >
      {/* Sidebar - Brand */}

      <div className="sidebar-brand-icon rotate-n-15">
        <i className="fas fa-laugh-wink" />
      </div>
      <div className="sidebar-brand-text mx-3">
        <li className="nav-item active">
          <div className="nav-link">BL</div>
        </li>
      </div>

      {/* Divider */}
      <hr className="sidebar-divider my-0" />
      {/* Nav Item - Dashboard */}
      <li className="nav-item active">
        <i className="fas fa-fw fa-tachometer-alt " />
        <Link to="/" className="nav-link">
          Classification
        </Link>
      </li>
      <hr className="sidebar-divider my-0" />
      {/* Nav Item - Dashboard */}
      <li className="nav-item active">
        <i className="fas fa-fw fa-tachometer-alt " />
        <Link to="/GradCAM" className="nav-link">
          GradCAM
        </Link>
      </li>
    </ul>
  );
}

export default Sidebar;
