import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { existenteEmail, esRoleValido } from "../helpers/db-validator.js";

// Validador para el registro de usuarios
export const registerValidator = [
    body("name", "The name is required!").not().isEmpty(),
    body("surname", "The surname is required!").not().isEmpty(),
    body("email", "You must enter a valid email!").isEmail(),
    body("email").custom(existenteEmail),
    body("role").custom(esRoleValido),
    body("password", "Password must be at least 8 characters!").isLength({ min: 8 }),
    validarCampos
];

// Validador para el login de usuarios
export const loginValidator = [
    body("email")
        .optional()
        .isEmail().withMessage("Enter a valid email address!"),
    body("username")
        .optional()
        .isString().withMessage("Enter a valid username!"),
    body("password", "Password must be at least 8 characters!").isLength({ min: 8 }),
    // Validar que al menos uno de los campos (email o username) esté presente
    body().custom((value, { req }) => {
        if (!req.body.email && !req.body.username) {
            throw new Error("You must provide either an email or a username!");
        }
        return true;
    }),
    validarCampos
];