import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideNavigation from "../components/SideNavigation";
import { ActiveTabProvider, useActiveTab } from "../contexts/ActiveTabContext";
import DashboardContent from "../components/DashboardContent";
import { AuthContext } from "../contexts/Authcontext";
import { OrganizeEventProvider } from "../contexts/OrganizeEventContext";
import { CreteVotingPoolProvider } from "../contexts/CreateVotingPoolContext";

const DashBoard = () => {
  const { role, userDetails } = useContext(AuthContext);
  const { userId } = useParams();
  // console.log("role from dashboard: ", role);

  return (
    <ActiveTabProvider>
      <OrganizeEventProvider>
        <CreteVotingPoolProvider>
          <div>
            <NavBar></NavBar>
            <div className="flex lg:flex-row flex-col">
              <SideNavigation></SideNavigation>
              <DashboardContent></DashboardContent>
            </div>
          </div>
        </CreteVotingPoolProvider>
      </OrganizeEventProvider>
    </ActiveTabProvider>
  );
};

export default DashBoard;
