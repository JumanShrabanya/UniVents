import React from "react";
import NavBar from "../components/NavBar";
import SideNavigation from "../components/SideNavigation";
import { ActiveTabProvider, useActiveTab } from "../contexts/ActiveTabContext";
import DashboardContent from "../components/DashboardContent";

const DashBoard = () => {
  return (
    <ActiveTabProvider>
      <div>
        <NavBar></NavBar>
        <div className="flex lg:flex-row flex-col">
          <SideNavigation></SideNavigation>
          <DashboardContent></DashboardContent>
        </div>
      </div>
    </ActiveTabProvider>
  );
};

export default DashBoard;
