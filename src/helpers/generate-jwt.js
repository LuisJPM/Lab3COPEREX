export const generateJWT = (uid = ' ') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(
            payload,
            process.env.SECRETORPRIVATEKEY,
            {
                expiresIn: '1h' // El token expira en 1 hora
            },
            (err, token) => {
                err ? (console.log(err), reject('Token not generated!')) : resolve(token);
            }
        );
    });
};