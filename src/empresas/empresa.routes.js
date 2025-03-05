import { Router } from "express";
import { check } from "express-validator";
import { getEmpresas, getEmpresaById, updateEmpresa, updateCategory, updateStatus, deleteEmpresa } from "./empresa.controller.js";
import { empresaExiste } from "../helpers/db-validator.js"; // Helper para validar si la empresa existe
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

// Ruta para obtener todas las empresas
router.get(
    "/",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE", "CLIENT_ROLE"), // Restringir el acceso a roles específicos
        validarCampos
    ],
    getEmpresas
);

// Ruta para obtener una empresa por ID
router.get(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "ID no válido!").isMongoId(),
        check("id").custom(empresaExiste),
        validarCampos
    ],
    getEmpresaById
);

// Ruta para actualizar los datos de una empresa
router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "ID no válido!").isMongoId(),
        check("id").custom(empresaExiste),
        validarCampos
    ],
    updateEmpresa
);

// Ruta para actualizar la categoría de una empresa
router.put(
    "/:id/category",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "ID no válido!").isMongoId(),
        check("id").custom(empresaExiste),
        validarCampos
    ],
    updateCategory
);

// Ruta para actualizar el estado de una empresa (activo/inactivo)
router.put(
    "/:id/status",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "ID no válido!").isMongoId(),
        check("id").custom(empresaExiste),
        validarCampos
    ],
    updateStatus
);

// Ruta para desactivar una empresa (cambiar el estado a false)
router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE", "CLIENT_ROLE"),
        check("id", "ID no válido!").isMongoId(),
        check("id").custom(empresaExiste),
        validarCampos
    ],
    deleteEmpresa
);

export default router;