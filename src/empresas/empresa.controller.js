import { response, request } from "express";
import Empresa from "./empresa.model.js";

// Obtener todas las empresas
export const getEmpresas = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const [total, empresas] = await Promise.all([
            Empresa.countDocuments({ estado: true }), // Solo empresas activas
            Empresa.find({ estado: true }).skip(Number(desde)).limit(Number(limite)), // Paginación
        ]);
        res.status(200).json({ success: true, total, empresas });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error al obtener las empresas!', error });
    }
};

// Actualizar empresa (incluye la opción de cambiar la categoría o nivel de impacto)
export const updateEmpresa = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, nivelImpacto, aniosTrayectoria, categoria, descripcion, contacto } = req.body;

        // Preparamos los datos a actualizar
        const data = {
            nombre,
            nivelImpacto,
            aniosTrayectoria,
            categoria,
            descripcion,
            contacto,
        };

        // Actualizamos la empresa en la base de datos
        const empresa = await Empresa.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json({ success: true, msg: 'Empresa actualizada!', empresa });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error al actualizar la empresa!', error });
    }
};

// Cambiar el estado de una empresa (activar/desactivar)
export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body; // estado es un booleano (true o false)

        const empresa = await Empresa.findByIdAndUpdate(id, { estado }, { new: true });
        res.status(200).json({ success: true, msg: 'Estado de la empresa actualizado!', empresa });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error al actualizar el estado de la empresa!', error });
    }
};

// Desactivar empresa (cambiar el estado a false)
export const deleteEmpresa = async (req, res) => {
    try {
        const { id } = req.params;

        // Desactivamos la empresa en lugar de eliminarla
        const empresa = await Empresa.findByIdAndUpdate(id, { estado: false }, { new: true });
        res.status(200).json({ success: true, msg: 'Empresa desactivada!', empresa });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error al desactivar la empresa!', error });
    }
};

// Actualizar la categoría de una empresa
export const updateEmpresaCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoria } = req.body;

        // Actualizamos solo la categoría
        const empresa = await Empresa.findByIdAndUpdate(id, { categoria }, { new: true });
        res.status(200).json({ success: true, msg: 'Categoría de la empresa actualizada!', empresa });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error al actualizar la categoría de la empresa!', error });
    }
};
