// src/services/modalidad.service.js

import * as ModalidadModel from "../models/modalidad.model.js";

export async function createModalidadService(nombre) {
    return ModalidadModel.createModalidadModel(nombre);
}

export async function findAllModalidadesService() {
    return ModalidadModel.findAllModalidadesModel();
}

export async function updateModalidadService(id, nombre) {
    return ModalidadModel.updateModalidadModel(id, nombre);
}

export async function deleteModalidadService(id) {
    // Convertir ID a entero antes de pasar al modelo
    const idInt = parseInt(id); 
    if (isNaN(idInt)) throw new Error("ID inválido.");
    return ModalidadModel.deleteModalidadModel(idInt);
}