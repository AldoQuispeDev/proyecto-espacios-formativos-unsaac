import { createContext, useEffect, useState, useContext } from "react";
import { me, logout } from "../api/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    me()
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  const cerrarSesion = async () => {
    await logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Agrega esto al final
export function useAuth() {
  return useContext(AuthContext);
}
