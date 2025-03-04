import Empresa from '../models/empresa.model.js'; // Suponiendo que tienes un modelo de Empresa
import { hashPassword, verifyPassword } from 'argon2'; // No es necesario si no se maneja la contraseña
import { generateJWTToken } from '../helpers/jwt-helper.js'; // Mantener la generación del JWT

// Login para una empresa
export const empresaLogin = async (req, res) => {
    const { emailEmpresa, password, nombreEmpresa } = req.body;

    try {
        const normalizedEmail = emailEmpresa ? emailEmpresa.toLowerCase() : null;
        const normalizedNombreEmpresa = nombreEmpresa ? nombreEmpresa.toLowerCase() : null;

        // Buscar la empresa por email o nombre
        const empresa = await Empresa.findOne({
            $or: [{ emailEmpresa: normalizedEmail }, { nombreEmpresa: normalizedNombreEmpresa }]
        });

        if (!empresa) {
            return res.status(400).json({
                msg: 'Credenciales inválidas - ¡email o nombre de empresa no encontrado!'
            });
        }

        if (!empresa.estado) {
            return res.status(400).json({
                msg: 'Esta empresa está inactiva en el sistema.'
            });
        }

        // Si la empresa tuviera una contraseña, validamos la misma
        // Suponiendo que el modelo de empresa también tiene un campo `password` (de ser necesario)
        const passwordValid = await verifyPassword(empresa.password, password);
        if (!passwordValid) {
            return res.status(400).json({
                msg: '¡Contraseña incorrecta proporcionada!'
            });
        }

        // Generación del token de autenticación
        const token = await generateJWTToken(empresa.id);

        return res.status(200).json({
            msg: '¡Inicio de sesión exitoso!',
            empresaDetails: {
                nombreEmpresa: empresa.nombreEmpresa,
                token: token,
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "¡Error en el servidor!",
            error: err.message
        });
    }
};

// Registro de una nueva empresa
export const empresaRegistration = async (req, res) => {
    try {
        const { nombreEmpresa, direccionEmpresa, emailEmpresa, telefonoEmpresa, password, categoriaEmpresa, nivelImpacto, anoFundacion } = req.body;

        // Verificar si la empresa ya existe por email o nombre
        const empresaExistente = await Empresa.findOne({ $or: [{ emailEmpresa }, { nombreEmpresa }] });
        if (empresaExistente) {
            return res.status(400).json({
                msg: '¡Ya existe una empresa con este email o nombre!'
            });
        }

        // Encriptar la contraseña de la empresa si es necesario
        const hashedPassword = await hashPassword(password);

        // Crear la empresa en la base de datos
        const nuevaEmpresa = await Empresa.create({
            nombreEmpresa,
            direccionEmpresa,
            emailEmpresa,
            telefonoEmpresa,
            password: hashedPassword,
            categoriaEmpresa,
            nivelImpacto,
            anoFundacion
        });

        return res.status(201).json({
            message: "¡Empresa registrada exitosamente!",
            empresaDetails: {
                emailEmpresa: nuevaEmpresa.emailEmpresa,
                nombreEmpresa: nuevaEmpresa.nombreEmpresa
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "¡Error en el registro de la empresa!",
            error: error.message
        });
    }
};
