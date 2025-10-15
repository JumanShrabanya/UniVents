import { useContext, useEffect, useState } from "react";
import { AuthProvider } from "../src/contexts/Authcontext";
import { EditEventProvider } from "./contexts/EditEventContext";
import { UserTypeProvider } from "./contexts/UserTypeContext";
import { LoginCardProvider } from "./contexts/LoginCardContext";
import DashBoard from "./pages/DashBoard";
import EventsPage from "./pages/EventsPage";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";
import OrganizerRegistrationPage from "./pages/OrganizerRegistrationPage";
import ParticipantRegistrationPage from "./pages/ParticipantRegistrationPage";
import OTPVerificationPage from "./pages/OTPVerificationPage";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginCard from "./components/LoginCard";
import RegisterEventComponent from "./components/RegisterEventComponent";
import { RegisterCardProvider } from "./contexts/RegisterCardContext";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { CheckRegistrationProvider } from "./contexts/CheckRegistrationContext";
import VerifyEmail from "./components/VerifiyEmail";
import EventDetailsPage from "./pages/EventDetailsPage";
import OrganizerEventDetailsPage from "./pages/OrganizerEventDetailsPage";

const App = () => {
  return (
    <AuthProvider>
      <RegisterCardProvider>
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
                        element={
                          <RedirectIfAuthenticated>
                            <RegistrationPage></RegistrationPage>
                          </RedirectIfAuthenticated>
                        }
                      ></Route>
                      <Route
                        path="/register/organizer"
                        element={
                          <RedirectIfAuthenticated>
                            <OrganizerRegistrationPage></OrganizerRegistrationPage>
                          </RedirectIfAuthenticated>
                        }
                      ></Route>
                      <Route
                        path="/register/participant"
                        element={
                          <RedirectIfAuthenticated>
                            <ParticipantRegistrationPage></ParticipantRegistrationPage>
                          </RedirectIfAuthenticated>
                        }
                      ></Route>
                      <Route
                        path="/verify-otp"
                        element={
                          <RedirectIfAuthenticated>
                            <OTPVerificationPage></OTPVerificationPage>
                          </RedirectIfAuthenticated>
                        }
                      ></Route>
                      <Route
                        path="/dashboard/:userId"
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
                        path="/dashboard/:userId/event/:eventId"
                        element={
                          <ProtectedRoute
                            element={<OrganizerEventDetailsPage></OrganizerEventDetailsPage>}
                          ></ProtectedRoute>
                        }
                      ></Route>
                      <Route
                        path="/event/:eventId"
                        element={<EventDetailsPage></EventDetailsPage>}
                      ></Route>
                      <Route
                        path="/profile/:userId"
                        element={
                          <ProtectedRoute
                            element={<ProfilePage></ProfilePage>}
                          ></ProtectedRoute>
                        }
                      ></Route>
                      {/* for the email page */}
                      <Route
                        path="/verify-email/:token"
                        element={<VerifyEmail />}
                      />{" "}
                      {/* Route for email verification */}
                    </Routes>
                    {/* login card component */}
                    <LoginCard></LoginCard>
                    {/* side view card component for complete detailed view of the event */}
                    <RegisterEventComponent></RegisterEventComponent>
                  </main>
                </Router>
              </LoginCardProvider>
            </UserTypeProvider>
          </CheckRegistrationProvider>
        </EditEventProvider>
      </RegisterCardProvider>
    </AuthProvider>
  );
};

export default App;

