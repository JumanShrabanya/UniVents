import React from "react";
import NavBar from "../components/NavBar";
import SideNavigation from "../components/SideNavigation";
import { ActiveTabProvider, useActiveTab } from "../contexts/ActiveTabContext";

const DashBoard = () => {
  return (
    <ActiveTabProvider>
      <div>
        <NavBar></NavBar>
        <SideNavigation></SideNavigation>
      </div>
    </ActiveTabProvider>
  );
};

export default DashBoard;
