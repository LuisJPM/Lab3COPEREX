export const tieneRole = (...roles) => {
    return (req, res, next) => {
        // Verificar si el usuario está autenticado
        if (!req.usuario) {
            return res.status(500).json({
                success: false,
                msg: 'You want to verify a role without validating the token first!'
            });
        }

        // Verificar si el usuario tiene uno de los roles permitidos
        if (!roles.includes(req.usuario.role)) {
            return res.status(403).json({ // 403 Forbidden
                success: false,
                msg: `User not authorized. Current role: ${req.usuario.role}, authorized roles: ${roles.join(', ')}!`
            });
        }

        // Si el usuario tiene un rol permitido, continuar
        next();
    };
};