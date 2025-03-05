import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { dbConnection } from './mongo.js';  // Importar la conexión a la base de datos
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';
import empresaRoutes from '../src/empresas/empresa.routes.js';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Configuración de middlewares
const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
};

// Rutas de la API
const routes = (app) => {
    app.use("/coperexManager/v1/auth", authRoutes);
    app.use("/coperexManager/v1/users", userRoutes);
    app.use("/coperexManager/v1/empresas", empresaRoutes);

    // Middleware para manejar rutas no encontradas (404)
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            msg: "Ruta no encontrada!"
        });
    });
};

// Conectar a la base de datos MongoDB
const conectarDB = async () => {
    try {
        await dbConnection();  // Usar la función de conexión a la base de datos
        console.log('¡Conexión exitosa a la base de datos!');
    } catch (error) {
        console.error('¡Error al conectar a la base de datos!', error.message);
        process.exit(1);
    }
};

// Inicializar el servidor
export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3004;

    try {
        middlewares(app);
        await conectarDB();  // Conectar a la base de datos antes de iniciar el servidor
        routes(app);
        app.listen(port, () => {
            console.log(`Servidor corriendo en el puerto ${port}!`);
        });
    } catch (err) {
        console.error('¡Error al iniciar el servidor!', err.message);
    }
};

// Iniciar el servidor
initServer();