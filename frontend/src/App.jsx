import { useContext, useEffect, useState } from "react";
import { AuthContext, AuthProvider } from "../src/contexts/Authcontext";
import { UserTypeProvider } from "./contexts/UserTypeContext";
import { LoginCardProvider } from "./contexts/LoginCardContext";
import DashBoard from "./pages/DashBoard";
import EventsPage from "./pages/EventsPage";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginCard from "./components/LoginCard";
import RegisterEventComponent from "./components/RegisterEventComponent";
import { RegisterCardProvider } from "./contexts/RegisterCardContext";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { CheckRegistrationProvider } from "./contexts/CheckRegistrationContext";

const App = () => {
  return (
    <AuthProvider>
      <CheckRegistrationProvider>
        <UserTypeProvider>
          <LoginCardProvider>
            <RegisterCardProvider>
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
                      element={
                        <ProtectedRoute
                          element={<DashBoard></DashBoard>}
                        ></ProtectedRoute>
                      }
                    ></Route>
                    <Route
                      path="/events"
                      element={<EventsPage></EventsPage>}
                    ></Route>
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute
                          element={<ProfilePage></ProfilePage>}
                        ></ProtectedRoute>
                      }
                    ></Route>
                  </Routes>
                  {/* login card component */}
                  <LoginCard></LoginCard>
                  {/* side view card component for complete detailed view of the event */}
                  <RegisterEventComponent></RegisterEventComponent>
                </main>
              </Router>
            </RegisterCardProvider>
          </LoginCardProvider>
        </UserTypeProvider>
      </CheckRegistrationProvider>
    </AuthProvider>
  );
};

export default App;
