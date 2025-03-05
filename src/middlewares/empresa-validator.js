import { body, param } from "express-validator";
import { existenteEmail, empresaExiste } from "../helpers/db-validator.js";
import { validarCampos } from "./validar-campos.js";
import { deleteFileOnError } from "./delete-file-on-error.js";
import { handleErrors } from "./handle-errors.js";
import { validarJWT } from "./validar-jwt.js";

// Validador para el login de la empresa
export const loginEmpresaValidator = [
    body("emailEmpresa")
        .notEmpty().withMessage("El email es requerido")
        .isEmail().withMessage("No es un email válido"),
    body("password")
        .notEmpty().withMessage("La contraseña es requerida"),
    validarCampos,
    handleErrors
];

// Validador para el registro de la empresa
export const registroEmpresaValidator = [
    body("nombreEmpresa")
        .notEmpty().withMessage("El nombre de la empresa es requerido")
        .isLength({ max: 100 }).withMessage("El nombre debe tener un máximo de 100 caracteres"),
    body("emailEmpresa")
        .notEmpty().withMessage("El email es requerido")
        .isEmail().withMessage("No es un email válido")
        .custom(existenteEmail), // Verifica que el email no exista en la base de datos
    body("password")
        .notEmpty().withMessage("La contraseña es requerida")
        .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    validarCampos,
    handleErrors
];

// Validador para agregar una nueva empresa
export const agregarEmpresaValidator = [
    validarJWT, // Verifica que el usuario esté autenticado
    body("nombreEmpresa")
        .notEmpty().withMessage("El nombre de la empresa es requerido")
        .isLength({ max: 100 }).withMessage("El nombre debe tener un máximo de 100 caracteres"),
    body("direccionEmpresa")
        .notEmpty().withMessage("La dirección es requerida")
        .isLength({ max: 200 }).withMessage("La dirección debe tener un máximo de 200 caracteres"),
    body("emailEmpresa")
        .notEmpty().withMessage("El email es requerido")
        .isEmail().withMessage("No es un email válido")
        .custom(existenteEmail), // Valida que el email no exista en la base de datos
    body("ContactoDueño")
        .notEmpty().withMessage("El nombre del dueño es requerido")
        .isLength({ max: 100 }).withMessage("El nombre del dueño debe tener un máximo de 100 caracteres"),
    body("anoFundacion")
        .notEmpty().withMessage("El año de fundación es requerido")
        .isInt({ min: 1900, max: new Date().getFullYear() }).withMessage("El año de fundación debe ser un número válido entre 1900 y el año actual"),
    body("categoriaEmpresa")
        .notEmpty().withMessage("Debes ingresar una categoría")
        .isIn(["Tecnología", "Salud", "Educación", "Retail", "Finanzas"]).withMessage("La categoría no es válida"),
    body("nivelImpacto")
        .notEmpty().withMessage("El nivel de impacto es requerido")
        .isIn(["Bajo", "Medio", "Alto"]).withMessage("El nivel de impacto no es válido"),
    validarCampos, // Valida los campos
    deleteFileOnError, // Elimina el archivo si hay un error
    handleErrors // Maneja cualquier error
];

// Validador para editar los datos de una empresa
export const editarEmpresaValidator = [
    validarJWT, // Verifica que el usuario esté autenticado
    param("uid")
        .isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("uid")
        .custom(empresaExiste), // Verifica que la empresa exista en la base de datos
    body("nombreEmpresa")
        .optional()
        .isLength({ max: 100 }).withMessage("El nombre debe tener un máximo de 100 caracteres"),
    body("direccionEmpresa")
        .optional()
        .isLength({ max: 200 }).withMessage("La dirección debe tener un máximo de 200 caracteres"),
    body("emailEmpresa")
        .optional()
        .isEmail().withMessage("No es un email válido")
        .custom(existenteEmail), // Valida que el email no exista en la base de datos
    body("ContactoDueño")
        .optional()
        .isLength({ max: 100 }).withMessage("El nombre del dueño debe tener un máximo de 100 caracteres"),
    body("anoFundacion")
        .optional()
        .isInt({ min: 1900, max: new Date().getFullYear() }).withMessage("El año de fundación debe ser un número válido entre 1900 y el año actual"),
    body("categoriaEmpresa")
        .optional()
        .isIn(["Tecnología", "Salud", "Educación", "Retail", "Finanzas"]).withMessage("La categoría no es válida"),
    body("nivelImpacto")
        .optional()
        .isIn(["Bajo", "Medio", "Alto"]).withMessage("El nivel de impacto no es válido"),
    validarCampos, // Valida los campos
    deleteFileOnError, // Elimina el archivo si hay un error
    handleErrors // Maneja cualquier error
];

// Validador para generar el reporte en Excel
export const generarExcelreporte = [
    validarJWT, // Verifica que el usuario esté autenticado
    validarCampos, // Valida los campos
    deleteFileOnError, // Elimina el archivo si hay un error
    handleErrors // Maneja cualquier error
];