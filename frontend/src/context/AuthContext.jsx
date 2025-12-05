import { createContext, useEffect, useState, useContext } from "react";
import { me, logout } from "../api/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticación al cargar (silenciosamente)
    me()
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((error) => {
        // No mostrar error si no hay usuario logueado (es normal)
        // Solo loguear si es un error diferente a 401
        if (error.response?.status !== 401) {
          console.error("Error al verificar autenticación:", error);
        }
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const cerrarSesion = async () => {
    try {
      await logout();
    } catch (error) {
      // Ignorar errores al cerrar sesión si ya no hay sesión
      if (error.response?.status !== 401) {
        console.error("Error al cerrar sesión:", error);
      }
    } finally {
      setUser(null);
    }
  };

  // Renderizar children inmediatamente, no esperar la verificación
  return (
    <AuthContext.Provider value={{ user, setUser, cerrarSesion, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
