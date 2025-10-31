import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Matricula from "./pages/Matricula";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import PrivateRoute from "./components/PrivateRoute";
import Principal from "./pages/Principal";

import ValidarMatricula from "./pages/admin/ValidarMatricula";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/matricula" element={<Matricula />} />
          <Route path="/principal" element={<Principal />} />

          {/* Panel solo visible para ADMIN */}
          <Route
            path="/admin"
            element={
              <PrivateRoute role="ADMIN">
                <DashboardAdmin/>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/validarMatricula"
            element={
              <PrivateRoute role="ADMIN">
                <ValidarMatricula />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
