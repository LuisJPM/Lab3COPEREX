import { Schema, model } from "mongoose";  // Importar Schema y model desde mongoose

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "The name is required!"],
    },
    email: {
        type: String,
        required: [true, "The email is required!"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "The password is required!"],
    },
    role: {
        type: String,
        default: "ADMIN_ROLE", // Solo administradores
    },
    estado: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,  // Agrega campos createdAt y updatedAt automáticamente
    versionKey: false, // Desactiva la propiedad __v en los documentos
});

export default model('User', UserSchema);  // Exportar el modelo