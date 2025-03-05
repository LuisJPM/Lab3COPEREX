import { response, request } from "express";
import Empresa from "./empresa.model.js";

// Obtener todas las empresas
export const getEmpresas = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;

        // Validar que los parámetros sean números válidos y no negativos
        const limiteNum = Number(limite);
        const desdeNum = Number(desde);
        if (isNaN(limiteNum) || isNaN(desdeNum) || limiteNum < 0 || desdeNum < 0) {
            return res.status(400).json({ success: false, msg: 'Los parámetros "limite" y "desde" deben ser números válidos y no negativos!' });
        }

        const [total, empresas] = await Promise.all([
            Empresa.countDocuments({ estado: true }), // Solo empresas activas
            Empresa.find({ estado: true }).skip(desdeNum).limit(limiteNum), // Paginación
        ]);
        res.status(200).json({ success: true, total, empresas });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error getting empresas!', error });
    }
};

// Obtener una empresa por ID
export const getEmpresaById = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar la empresa por ID
        const empresa = await Empresa.findById(id);

        // Verificar si la empresa existe
        if (!empresa) {
            return res.status(404).json({ success: false, msg: 'La empresa no existe!' });
        }

        res.status(200).json({ success: true, empresa });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error getting empresa by ID!', error });
    }
};

// Actualizar una empresa
export const updateEmpresa = async (req, res) => {
    try {
        const { id } = req.params;
        const { ...data } = req.body;

        // Validar que la empresa exista antes de actualizarla
        const empresaExistente = await Empresa.findById(id);
        if (!empresaExistente) {
            return res.status(404).json({ success: false, msg: 'La empresa no existe!' });
        }

        // Actualizar la empresa en la base de datos
        const empresa = await Empresa.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json({ success: true, msg: 'Empresa updated!', empresa });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error updating empresa!', error });
    }
};

// Actualizar la categoría de una empresa
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoriaEmpresa } = req.body;

        // Validar que la empresa exista antes de actualizarla
        const empresaExistente = await Empresa.findById(id);
        if (!empresaExistente) {
            return res.status(404).json({ success: false, msg: 'La empresa no existe!' });
        }

        // Validar que la categoría sea válida
        const categoriasValidas = ["Tecnología", "Salud", "Educación", "Retail", "Finanzas"];
        if (!categoriasValidas.includes(categoriaEmpresa)) {
            return res.status(400).json({ success: false, msg: 'La categoría no es válida!' });
        }

        // Actualizar la categoría de la empresa
        const empresa = await Empresa.findByIdAndUpdate(id, { categoriaEmpresa }, { new: true });
        res.status(200).json({ success: true, msg: 'Category updated!', empresa });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error updating category!', error });
    }
};

// Actualizar el estado de una empresa (activo/inactivo)
export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        // Validar que la empresa exista antes de actualizarla
        const empresaExistente = await Empresa.findById(id);
        if (!empresaExistente) {
            return res.status(404).json({ success: false, msg: 'La empresa no existe!' });
        }

        // Validar que el estado sea un booleano
        if (typeof estado !== 'boolean') {
            return res.status(400).json({ success: false, msg: 'El campo "estado" debe ser un booleano!' });
        }

        // Actualizar el estado de la empresa
        const empresa = await Empresa.findByIdAndUpdate(id, { estado }, { new: true });
        res.status(200).json({ success: true, msg: 'Status updated!', empresa });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error updating status!', error });
    }
};

// Eliminar (desactivar) una empresa
export const deleteEmpresa = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar que la empresa exista antes de desactivarla
        const empresaExistente = await Empresa.findById(id);
        if (!empresaExistente) {
            return res.status(404).json({ success: false, msg: 'La empresa no existe!' });
        }

        // Desactivar la empresa en lugar de eliminarla
        const empresa = await Empresa.findByIdAndUpdate(id, { estado: false }, { new: true });
        res.status(200).json({ success: true, msg: 'Empresa deactivated!', empresa });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error deactivating empresa!', error });
    }
};