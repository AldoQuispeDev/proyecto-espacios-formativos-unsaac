// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Componentes de Página
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Matricula from "./pages/Matricula";
import Principal from "./pages/Principal";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Test from "./pages/Test";
import AulaVirtual from "./pages/estudiante/AulaVirtual";

// Componentes de Docente
import DashboardDocente from "./pages/docente/DashboardDocente";

// Componentes de Administración
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import ValidarMatricula from "./pages/admin/ValidarMatricula";
import GestionEstudiantes from "./pages/admin/GestionEstudiantes";
import GestionDocentes from "./pages/admin/GestionDocentes";
import GestionCatalogos from "./pages/admin/GestionCatalogos";
import GestionHorarios from "./pages/admin/GestionHorarios";
import EstudiantesDocente from "./pages/docente/EstudiantesDocente";

import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* PAGINA DE ATERRIZAJE PUBLICA */}
          <Route path="/" element={<Principal />} />
          <Route path="/principal" element={<Principal />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/test" element={<Test />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* RUTAS PROTEGIDAS ESTUDIANTE */}
          <Route
            path="/matricula"
            element={
              <PrivateRoute role="ESTUDIANTE">
                <Matricula />
              </PrivateRoute>
            }
          />
          <Route
            path="/estudiante/aula"
            element={
              <PrivateRoute role="ESTUDIANTE">
                <AulaVirtual />
              </PrivateRoute>
            }
          />

          {/* RUTAS PROTEGIDAS DOCENTE */}
          <Route
            path="/docente"
            element={
              <PrivateRoute role="DOCENTE">
                <DashboardDocente />
              </PrivateRoute>
            }
          />
          <Route
            path="/docente/estudiantes"
            element={
              <PrivateRoute role="DOCENTE">
                <EstudiantesDocente />
              </PrivateRoute>
            }
          />

          {/* RUTAS ADMIN */}
          <Route
            path="/admin"
            element={
              <PrivateRoute role="ADMIN">
                <DashboardAdmin />
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
          <Route
            path="/admin/docentes"
            element={
              <PrivateRoute role="ADMIN">
                <GestionDocentes />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/estudiantes"
            element={
              <PrivateRoute role="ADMIN">
                <GestionEstudiantes />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/catalogos"
            element={
              <PrivateRoute role="ADMIN">
                <GestionCatalogos />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/horarios"
            element={
              <PrivateRoute role="ADMIN">
                <GestionHorarios />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
