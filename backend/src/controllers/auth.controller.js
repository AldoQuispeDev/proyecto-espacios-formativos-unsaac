import * as service from "../services/auth.service.js";

// 🔹 REGISTRO
export async function register(req, res) {
  try {
    const resp = await service.register(req.body);
    return res.status(resp.status).json(resp.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno al registrar usuario" });
  }
}

// 🔹 LOGIN (corrigido)
export async function login(req, res) {
  try {
    const resp = await service.login(req.body);
    const { status, data } = resp;

    const token = data?.token;

    if (token) {
      //  Crear cookie desde el BACKEND (dominio del servidor)
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, 
        sameSite: "lax",
        path: "/",
        domain: "localhost", 
        maxAge: 24 * 60 * 60 * 1000, // 1 día
      });
      console.log("🍪 Cookie JWT creada correctamente en backend");
    } else {
      console.warn("⚠️ No se generó token en el login");
    }

    return res.status(status).json(data);
  } catch (error) {
    console.error("❌ Error interno al iniciar sesión:", error);
    return res.status(500).json({ error: "Error interno al iniciar sesión" });
  }
}

// 🔹 DATOS DEL USUARIO AUTENTICADO
export async function me(req, res) {
  return res.json({ user: req.user });
}

// 🔹 CERRAR SESIÓN
export async function logout(req, res) {
  res.clearCookie("token", {
    path: "/",
    domain: "localhost", // 👈 mismo dominio
  });
  res.json({ ok: true, message: "Sesión cerrada correctamente" });
}
