import React from "react";
// import logo from "./logo.svg";
import Sidebar from "../sidebar/sidebar";
import Content from "../contentCls";
function Main() {
  return (
    <div id="wrapper">
      <Sidebar />
      <Content />
    </div>
  );
}

export default Main;
