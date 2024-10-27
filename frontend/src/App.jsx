import { AuthProvider } from "../src/contexts/Authcontext";
import { UserTypeProvider } from "./contexts/UserTypeContext";
import HomePage from "./pages/HomePage";
import RegistrationPage from "./pages/RegistrationPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const App = () => {
  return (
    <AuthProvider>
      <UserTypeProvider>
        <Router>
          <main className="h-full">
            <Routes>
              <Route path="/" element={<HomePage></HomePage>}></Route>
              <Route
                path="/registration"
                element={<RegistrationPage></RegistrationPage>}
              ></Route>
            </Routes>
          </main>
        </Router>
      </UserTypeProvider>
    </AuthProvider>
  );
};

export default App;
