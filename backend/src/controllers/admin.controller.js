import * as adminService from "../services/admin.service.js";

export const obtenerMatriculas = async (req, res) => {
  try {
    const matriculas = await adminService.obtenerMatriculas();
    res.json(matriculas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las matrículas" });
  }
};

export const actualizarEstadoMatricula = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const matricula = await adminService.actualizarEstadoMatricula(id, estado);
    res.json({ message: "Estado actualizado correctamente", matricula });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la matrícula" });
  }
};
