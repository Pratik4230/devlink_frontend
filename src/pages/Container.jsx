import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import FooterBar from "../components/FooterBar";

const Container = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 p-4 my-10">
        <Outlet />
      </main>

      <FooterBar />
    </div>
  );
};

export default Container;
