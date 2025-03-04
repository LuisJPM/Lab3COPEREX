import { Router } from "express";
import { check } from "express-validator";
import { getUsers, getUserById, updateUser, updatePassword, updateStatus, deleteUser } from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

// Ruta para obtener todos los usuarios
router.get("/", getUsers);

// Ruta para obtener un usuario por ID
router.get(
    "/findUser/:id",
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
    "/updatePassword/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "ID no válido!").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updatePassword
);

// Ruta para actualizar el estado de un usuario (activo/inactivo)
router.put(
    "/updateStatus/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "ID no válido!").isMongoId(),
        check("id").custom(existeUsuarioById),
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
