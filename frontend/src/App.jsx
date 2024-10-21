import { AuthProvider } from "../src/contexts/Authcontext";
import NavBar from "./components/NavBar";

const App = () => {
  return (
    <AuthProvider>
      <main className="h-full">
        <NavBar></NavBar>
      </main>
    </AuthProvider>
  );
};

export default App;
