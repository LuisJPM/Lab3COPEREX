import { body, param } from "express-validator";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { existeEmpresaById } from "../helpers/db-validators.js";  // Helper para validar si existe la empresa

// Validación para crear una empresa (o registrar una empresa)
export const createEmpresaValidator = [
    body("name")
        .notEmpty().withMessage("El nombre de la empresa es requerido")
        .isLength({ max: 100 }).withMessage("El nombre debe tener un máximo de 100 caracteres"),
    body("level")
        .notEmpty().withMessage("El nivel de impacto es requerido")
        .isIn(["Bajo", "Medio", "Alto"]).withMessage("El nivel de impacto no es válido"),
    body("category")
        .notEmpty().withMessage("La categoría de la empresa es requerida")
        .isIn(["Tecnología", "Salud", "Educación", "Retail", "Finanzas"]).withMessage("La categoría no es válida"),
    body("yearsOfExperience")
        .isInt({ min: 1 }).withMessage("Los años de trayectoria deben ser un número entero mayor a 0"),
    validarCampos,
    handleErrors
];

// Validación para actualizar los datos de una empresa
export const updateEmpresaValidator = [
    param("id")
        .isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("id")
        .custom(existeEmpresaById), // Comprobar que la empresa existe
    body("name")
        .optional()
        .notEmpty().withMessage("El nombre de la empresa no puede estar vacío")
        .isLength({ max: 100 }).withMessage("El nombre debe tener un máximo de 100 caracteres"),
    body("level")
        .optional()
        .notEmpty().withMessage("El nivel de impacto no puede estar vacío")
        .isIn(["Bajo", "Medio", "Alto"]).withMessage("El nivel de impacto no es válido"),
    body("category")
        .optional()
        .notEmpty().withMessage("La categoría no puede estar vacía")
        .isIn(["Tecnología", "Salud", "Educación", "Retail", "Finanzas"]).withMessage("La categoría no es válida"),
    body("yearsOfExperience")
        .optional()
        .isInt({ min: 1 }).withMessage("Los años de trayectoria deben ser un número entero mayor a 0"),
    validarCampos,
    handleErrors
];

// Validación para cambiar la categoría de una empresa
export const updateCategoryValidator = [
    param("id")
        .isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("id")
        .custom(existeEmpresaById),
    body("category")
        .notEmpty().withMessage("La categoría es requerida")
        .isIn(["Tecnología", "Salud", "Educación", "Retail", "Finanzas"]).withMessage("La categoría no es válida"),
    validarCampos,
    handleErrors
];

// Validación para cambiar el estado de una empresa (activo/inactivo)
export const updateStatusValidator = [
    param("id")
        .isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("id")
        .custom(existeEmpresaById),
    body("status")
        .isBoolean().withMessage("El estado debe ser un valor booleano"),
    validarCampos,
    handleErrors
];

// Validación para eliminar o desactivar una empresa
export const deleteEmpresaValidator = [
    param("id")
        .isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("id")
        .custom(existeEmpresaById),
    validarCampos,
    handleErrors
];