import { useContext, useEffect, useState } from "react";
import { AuthProvider } from "../src/contexts/Authcontext";
import { EditEventProvider } from "./contexts/EditEventContext";
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
import CastVoteComponent from "./components/CastVoteComponent";
import { CasteVoteCardProvider } from "./contexts/CastVoteCardContext";

const App = () => {
  return (
    <AuthProvider>
      <RegisterCardProvider>
        <CasteVoteCardProvider>
          <EditEventProvider>
            <CheckRegistrationProvider>
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
                      {/* side view of the voting component */}
                      <CastVoteComponent></CastVoteComponent>
                    </main>
                  </Router>
                </LoginCardProvider>
              </UserTypeProvider>
            </CheckRegistrationProvider>
          </EditEventProvider>
        </CasteVoteCardProvider>
      </RegisterCardProvider>
    </AuthProvider>
  );
};

export default App;
