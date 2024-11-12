import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import FooterBar from "../components/FooterBar";

const Container = () => {
  return (
    <>
      <Navbar />
      <p>Sidebar</p>
      <Outlet />
      <FooterBar />
    </>
  );
};

export default Container;
