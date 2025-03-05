export const handleErrors = (err, req, res, next) => {
    
    if(err.status === 400 || err.errors) {
        return res.status(400).json({
            success: false,
            message: err.errors
        });
    }

    return res.status(500).json({
        success: false,
        message: err.message
    });
}