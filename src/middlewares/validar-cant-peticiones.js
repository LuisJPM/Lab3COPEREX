import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 solicitudes por ventana de tiempo
    message: {
        success: false,
        msg: "Too many requests, try later!",
    },
});

export default limiter;