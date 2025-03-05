import { validationResult } from "express-validator";

export const validarCampos = (req, res, next) => {
    // Obtener los errores de validación
    const errors = validationResult(req);

    // Si hay errores, devolver una respuesta con los errores
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(), // Devuelve un array con los errores
        });
    }

    // Si no hay errores, continuar con el siguiente middleware
    next();
};