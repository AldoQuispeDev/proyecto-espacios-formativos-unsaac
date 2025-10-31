import jwt from "jsonwebtoken";

export function signUser(user) {
  return jwt.sign(
    { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}
