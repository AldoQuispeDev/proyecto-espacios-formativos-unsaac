// src/controllers/usuarios.controller.js

import * as usuarioService from "../services/usuario.service.js";

// Endpoint para obtener datos del usuario logueado
export const obtenerDatosUsuario = async (req, res) => {
  try {
    const userId = req.user.id; // ID viene del middleware requireAuth
    const perfil = await usuarioService.obtenerPerfilUsuario(userId);

    if (!perfil) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(perfil);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error al obtener datos del usuario" });
  }
};

// Endpoint para actualizar datos personales
export const actualizarDatosUsuario = async (req, res) => {
  try {
    const userId = req.user.id; // ID viene del middleware requireAuth
    const datos = req.body;

    const usuario = await usuarioService.actualizarDatosPersonales(userId, datos);
    res.json({
      message: "Datos personales actualizados correctamente",
      usuario: usuario,
    });
  } catch (error) {
    console.error("Error al actualizar datos:", error);
    res.status(500).json({ error: "Error al actualizar datos personales" });
  }
};