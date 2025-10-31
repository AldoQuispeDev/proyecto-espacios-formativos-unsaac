import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, role }) {
  const { user } = useAuth();

  // Si no hay usuario logueado → redirige al login
  if (!user) return <Navigate to="/login" />;

  // Si tiene rol, pero no es el correcto → redirige a su página
  if (role && user.rol !== role) {
    return <Navigate to="/matricula" />;
  }

  // Si pasa todo → renderiza el contenido
  return children;
}
