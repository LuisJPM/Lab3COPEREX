import { Router } from "express";
import { check } from "express-validator";
import { getUsers, getUserById, updateUser, updatePassword, updateStatus, deleteUser } from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

// Ruta para obtener todos los usuarios
router.get(
    "/",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE", "CLIENT_ROLE"), // Restringir el acceso a roles específicos
        validarCampos
    ],
    getUsers
);

// Ruta para obtener un usuario por ID
router.get(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "ID no válido!").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
);

// Ruta para actualizar los datos de un usuario
router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "ID no válido!").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateUser
);

// Ruta para actualizar la contraseña de un usuario
router.put(
    "/:id/password",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "ID no válido!").isMongoId(),
        check("id").custom(existeUsuarioById),
        check("password", "La contraseña debe tener al menos 8 caracteres!").isLength({ min: 8 }),
        validarCampos
    ],
    updatePassword
);

// Ruta para actualizar el estado de un usuario (activo/inactivo)
router.put(
    "/:id/status",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "ID no válido!").isMongoId(),
        check("id").custom(existeUsuarioById),
        check("estado", "El campo 'estado' debe ser un booleano!").isBoolean(),
        validarCampos
    ],
    updateStatus
);

// Ruta para eliminar (desactivar) un usuario
router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE", "CLIENT_ROLE"),
        check("id", "ID no válido!").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteUser
);

export default router;
