import { Router } from 'express';
import { empresaLogin, empresaRegistration } from './auth.controller.js'; // Importar controladores
import { loginEmpresaValidator, registroEmpresaValidator } from '../middlewares/empresa-validator.js'; // Importar validadores

const authRouter = Router();

authRouter.post(
    '/login',
    loginEmpresaValidator,
    empresaLogin 
);

authRouter.post(
    '/register',
    registroEmpresaValidator, 
    empresaRegistration 
);

export default authRouter;