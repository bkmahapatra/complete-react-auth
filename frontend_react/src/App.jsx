import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Unauthorized from "./pages/Unauthorized";
import Notfound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Notfound />} />

          <Route path="dashboard"
            element={<ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>}
          />
          <Route path="profile"
            element={<ProtectedRoute>
              <Profile />
            </ProtectedRoute>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>

}

export default App
