import { useEffect, useState } from "react";
import { AuthProvider } from "../src/contexts/Authcontext";
import { UserTypeProvider } from "./contexts/UserTypeContext";
import { LoginCardProvider } from "./contexts/LoginCardContext";
import DashBoard from "./pages/DashBoard";
import EventsPage from "./pages/EventsPage";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginCard from "./components/LoginCard";

const App = () => {
  return (
    <AuthProvider>
      <UserTypeProvider>
        <LoginCardProvider>
          <Router>
            <main className="relative h-full">
              <Routes>
                <Route path="/" element={<HomePage></HomePage>}></Route>
                <Route
                  path="/registration"
                  element={<RegistrationPage></RegistrationPage>}
                ></Route>
                <Route
                  path="/dashboard"
                  element={<DashBoard></DashBoard>}
                ></Route>
                <Route
                  path="/events"
                  element={<EventsPage></EventsPage>}
                ></Route>
              </Routes>
              {/* login card component */}
              <LoginCard></LoginCard>
            </main>
          </Router>
        </LoginCardProvider>
      </UserTypeProvider>
    </AuthProvider>
  );
};

export default App;
