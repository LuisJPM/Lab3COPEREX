import { response, request } from "express";
import { hash } from "argon2";
import User from "./user.model.js";

// Obtener todos los usuarios
export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;

        // Validar que los parámetros sean números válidos y no negativos
        const limiteNum = Number(limite);
        const desdeNum = Number(desde);
        if (isNaN(limiteNum) || isNaN(desdeNum) || limiteNum < 0 || desdeNum < 0) {
            return res.status(400).json({ success: false, msg: 'Los parámetros "limite" y "desde" deben ser números válidos y no negativos!' });
        }

        const [total, users] = await Promise.all([
            User.countDocuments({ estado: true }), // Solo usuarios activos
            User.find({ estado: true }).skip(desdeNum).limit(limiteNum), // Paginación
        ]);
        res.status(200).json({ success: true, total, users });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error getting users!', error });
    }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar el usuario por ID
        const user = await User.findById(id);

        // Verificar si el usuario existe
        if (!user) {
            return res.status(404).json({ success: false, msg: 'El usuario no existe!' });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error getting user by ID!', error });
    }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, ...data } = req.body;

        // Validar que el usuario exista antes de actualizarlo
        const userExistente = await User.findById(id);
        if (!userExistente) {
            return res.status(404).json({ success: false, msg: 'El usuario no existe!' });
        }

        // Encriptar la contraseña si se proporciona
        if (password) {
            data.password = await hash(password);
        }

        // Actualizar el usuario en la base de datos
        const user = await User.findByIdAndUpdate(id, data, { new: true });
        res.status(200).json({ success: true, msg: 'User updated!', user });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error updating user!', error });
    }
};

// Actualizar la contraseña de un usuario
export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        // Validar que el usuario exista antes de actualizarlo
        const userExistente = await User.findById(id);
        if (!userExistente) {
            return res.status(404).json({ success: false, msg: 'El usuario no existe!' });
        }

        // Validar que la contraseña tenga al menos 8 caracteres
        if (password.length < 8) {
            return res.status(400).json({ success: false, msg: 'La contraseña debe tener al menos 8 caracteres!' });
        }

        // Encriptar la contraseña
        const hashedPassword = await hash(password);
        const user = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
        res.status(200).json({ success: true, msg: 'Password updated!', user });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error updating password!', error });
    }
};

// Desactivar un usuario
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar que el usuario exista antes de desactivarlo
        const userExistente = await User.findById(id);
        if (!userExistente) {
            return res.status(404).json({ success: false, msg: 'El usuario no existe!' });
        }

        // Desactivar el usuario en lugar de eliminarlo
        const user = await User.findByIdAndUpdate(id, { estado: false }, { new: true });
        res.status(200).json({ success: true, msg: 'User deactivated!', user });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error deactivating user!', error });
    }
};

// Actualizar el estado de un usuario
export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        // Validar que el usuario exista antes de actualizarlo
        const userExistente = await User.findById(id);
        if (!userExistente) {
            return res.status(404).json({ success: false, msg: 'El usuario no existe!' });
        }

        // Validar que el estado sea un booleano
        if (typeof estado !== 'boolean') {
            return res.status(400).json({ success: false, msg: 'El campo "estado" debe ser un booleano!' });
        }

        // Actualizar el estado del usuario
        const user = await User.findByIdAndUpdate(id, { estado }, { new: true });
        res.status(200).json({ success: true, msg: 'Status updated!', user });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Error updating status!', error });
    }
};