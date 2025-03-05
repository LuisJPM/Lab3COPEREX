import { Schema, model } from "mongoose";  // Importar Schema y model desde mongoose

const EmpresaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre de la empresa es obligatorio!"],
    },
    nivelImpacto: {
        type: String,
        required: [true, "El nivel de impacto es obligatorio!"],
        enum: ["Bajo", "Medio", "Alto"],
    },
    aniosTrayectoria: {
        type: Number,
        required: [true, "Los años de trayectoria son obligatorios!"],
    },
    categoria: {
        type: String,
        required: [true, "La categoría empresarial es obligatoria!"],
        enum: ["Tecnología", "Salud", "Educación", "Retail", "Finanzas"],
    },
    descripcion: {
        type: String,
        maxlength: [500, "La descripción debe tener un máximo de 500 caracteres!"],
    },
    contacto: {
        type: String,
        required: [true, "El contacto es obligatorio!"],
    },
    estado: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,  // Agrega campos createdAt y updatedAt automáticamente
    versionKey: false, // Desactiva la propiedad __v en los documentos
});

export default model('Empresa', EmpresaSchema);  // Exportar el modelo