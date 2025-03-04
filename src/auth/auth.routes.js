import { Router } from 'express';
import { empresaLogin, empresaRegistration } from './auth.controller.js';
import { agregarEmpresaValidator, editarEmpresaValidator } from '../middlewares/empresa-validator.js'; // Asumo que ya tienes los validadores específicos para empresas
import { removeFileOnFailure } from '../middlewares/delete-file-on-error.js';

const authRouter = Router();

// Ruta para login de empresa
authRouter.post(
    '/login',
    agregarEmpresaValidator, // Aquí puede ir el validador de login si fuera necesario
    removeFileOnFailure,
    empresaLogin
);

// Ruta para registro de empresa
authRouter.post(
    '/register',
    agregarEmpresaValidator, // Aquí puede ir el validador de registro si fuera necesario
    removeFileOnFailure,
    empresaRegistration
);

export default authRouter;
