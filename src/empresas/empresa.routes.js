import { Router } from "express";
import { check } from "express-validator";
import { getEmpresas, getEmpresaById, updateEmpresa, updateCategory, updateStatus, deleteEmpresa } from "./empresa.controller.js";
import { existeEmpresaById } from "../helpers/db-validator.js"; // Helper para validar si la empresa existe
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

// Ruta para obtener todas las empresas
router.get("/", getEmpresas);

// Ruta para obtener una empresa por ID
router.get(
    "/findEmpresa/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "ID no válido!").isMongoId(),
        check("id").custom(existeEmpresaById),
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
        check("id").custom(existeEmpresaById),
        validarCampos
    ],
    updateEmpresa
);

// Ruta para actualizar la categoría de una empresa
router.put(
    "/updateCategory/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "ID no válido!").isMongoId(),
        check("id").custom(existeEmpresaById),
        validarCampos
    ],
    updateCategory
);

// Ruta para actualizar el estado de una empresa (activo/inactivo)
router.put(
    "/updateStatus/:id",
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        check("id", "ID no válido!").isMongoId(),
        check("id").custom(existeEmpresaById),
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
        check("id").custom(existeEmpresaById),
        validarCampos
    ],
    deleteEmpresa
);

export default router;

