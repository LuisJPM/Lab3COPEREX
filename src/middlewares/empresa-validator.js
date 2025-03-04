import { body, param } from "express-validator";
import { emailExists, empresaExiste } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { deleteFileOnError } from "./delete-file-on-error.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";

// Validación para agregar una nueva empresa
export const agregarEmpresaValidator = [
    validateJWT, // Verifica que el usuario esté autenticado
    body("nombreEmpresa")
        .notEmpty().withMessage("El nombre de la empresa es requerido"),
    body("direccionEmpresa")
        .notEmpty().withMessage("La dirección es requerida"),
    body("emailEmpresa")
        .notEmpty().withMessage("El email es requerido")
        .isEmail().withMessage("No es un email válido")
        .custom(emailExists), // Valida que el email no exista en la base de datos
    body("ContactoDueño")
        .notEmpty().withMessage("El nombre del dueño es requerido"),
    body("anoFundacion")
        .notEmpty().withMessage("El año de fundación es requerido")
        .isInt({ min: 1900 }).withMessage("El año de fundación debe ser un número válido"),
    body("categoriaEmpresa")
        .notEmpty().withMessage("Debes ingresar una categoría"),
    body("nivelImpacto")
        .notEmpty().withMessage("El nivel de impacto es requerido"),
    validarCampos, // Valida los campos
    deleteFileOnError, // Elimina el archivo si hay un error
    handleErrors // Maneja cualquier error
];

// Validación para editar los datos de una empresa
export const editarEmpresaValidator = [
    validateJWT, // Verifica que el usuario esté autenticado
    param("uid")
        .isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("uid")
        .custom(empresaExiste), // Verifica que la empresa exista en la base de datos
    validarCampos, // Valida los campos
    deleteFileOnError, // Elimina el archivo si hay un error
    handleErrors // Maneja cualquier error
];

// Validación para generar el reporte en Excel
export const generarExcelreporte = [
    validateJWT, // Verifica que el usuario esté autenticado
    validarCampos, // Valida los campos
    deleteFileOnError, // Elimina el archivo si hay un error
    handleErrors // Maneja cualquier error
];
