import fs from 'fs/promises';
import { join } from 'path';

export const deleteFileOnError = async (err, req, res, next) => {
    // Verificar si hay un archivo y una ruta de archivo en la solicitud
    if (req.file && req.filePath) {
        const filePath = join(req.filePath, req.file.filename); // Usar req.file.filename en lugar de req.filename
        try {
            // Intentar eliminar el archivo
            await fs.unlink(filePath);
            console.log(`Archivo eliminado: ${filePath}`);
        } catch (unlinkErr) {
            console.error('Error al eliminar el archivo:', unlinkErr);
        }
    }

    // Determinar el código de estado y el mensaje de error
    let statusCode = 500; // Código de estado por defecto
    let message = 'Error interno del servidor';

    if (err.status === 400 || err.errors) {
        statusCode = 400; // Bad Request
        message = err.errors || err.message;
    } else if (err.status === 404) {
        statusCode = 404; // Not Found
        message = err.message || 'Recurso no encontrado';
    } else if (err.status === 401 || err.status === 403) {
        statusCode = err.status; // Unauthorized o Forbidden
        message = err.message || 'No autorizado';
    }

    // Enviar la respuesta de error
    return res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Mostrar el stack trace solo en desarrollo
    });
};