'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { dbConnection } from './config/db.js';  // Asegúrate de que la ruta sea correcta
import limiter from './middlewares/validar-cant-peticiones.js';  // Asegúrate de que la ruta sea correcta
import authRoutes from './auth/auth.routes.js';  // Rutas de autenticación
import userRoutes from './users/user.routes.js';  // Rutas de usuarios
import empresaRoutes from './empresas/empresa.routes.js';  // Rutas de empresas

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Configuración de middlewares
const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));  // Para que Express pueda parsear datos URL encoded
    app.use(cors());  // Habilitar CORS para permitir solicitudes entre dominios
    app.use(express.json());  // Para parsear el cuerpo de las solicitudes en formato JSON
    app.use(helmet());  // Mejora la seguridad estableciendo HTTP headers de protección
    app.use(morgan('dev'));  // Logger para las peticiones HTTP
    app.use(limiter);  // Limitar el número de peticiones para prevenir abusos
};

// Rutas de la API
const routes = (app) => {
    app.use("/coperexManager/v1/auth", authRoutes);  // Rutas de autenticación
    app.use("/coperexManager/v1/users", userRoutes);  // Rutas de usuarios
    app.use("/coperexManager/v1/empresas", empresaRoutes);  // Rutas de empresas
};

// Conectar a la base de datos MongoDB
const conectarDB = async () => {
    try {
        await dbConnection();  // Conexión a MongoDB desde el helper db.js
        console.log('¡Conexión exitosa a la base de datos!');
    } catch (error) {
        console.log('¡Error al conectar a la base de datos!');
        process.exit(1);  // Si falla la conexión, detener el servidor
    }
};

// Inicializar el servidor
export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3004;  // Usar el puerto desde el .env o el puerto 3004 como predeterminado

    try {
        middlewares(app);  // Aplicar los middlewares
        await conectarDB();  // Conectar a la base de datos
        routes(app);  // Aplicar las rutas
        app.listen(port, () => {
            console.log(`Servidor corriendo en el puerto ${port}!`);
        });
    } catch (err) {
        console.log(`¡Error al iniciar el servidor! ${err}`);
    }
};
