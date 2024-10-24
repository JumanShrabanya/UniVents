import { AuthProvider } from "../src/contexts/Authcontext";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <AuthProvider>
      <main className="h-full">
        <HomePage></HomePage>
      </main>
    </AuthProvider>
  );
};

export default App;
