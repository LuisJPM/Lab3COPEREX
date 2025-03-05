import Empresa from '../empresas/empresa.model.js'
import argon2 from 'argon2'; // Corrección en la importación de argon2
import { generateJWT } from '../helpers/generate-jwt.js'; // Mantener la generación del JWT

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

        // Validar la contraseña si existe
        if (empresa.password) {
            const passwordValid = await argon2.verify(empresa.password, password);
            if (!passwordValid) {
                return res.status(400).json({
                    msg: '¡Contraseña incorrecta proporcionada!'
                });
            }
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
        const hashedPassword = await argon2.hash(password);

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