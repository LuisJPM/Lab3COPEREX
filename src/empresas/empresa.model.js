import { Schema, model } from "mongoose";

const EmpresaSchema = Schema({
    nombre: {
        type: String,
        required: [true, "El nombre de la empresa es obligatorio!"],
        maxlength: [100, "El nombre debe tener un máximo de 100 caracteres!"],
    },

    nivelImpacto: {
        type: String,
        required: [true, "El nivel de impacto es obligatorio!"],
        enum: ["Bajo", "Medio", "Alto"], // Puedes definir un conjunto de opciones para el nivel de impacto.
    },

    aniosTrayectoria: {
        type: Number,
        required: [true, "Los años de trayectoria son obligatorios!"],
        min: [0, "La trayectoria no puede ser menor que 0 años!"], 
    },

    categoria: {
        type: String,
        required: [true, "La categoría empresarial es obligatoria!"],
        enum: ["Tecnología", "Salud", "Educación", "Retail", "Finanzas"], // Un conjunto de categorías predefinidas.
    },

    descripcion: {
        type: String,
        maxlength: [500, "La descripción debe tener un máximo de 500 caracteres!"], // Descripción adicional sobre la empresa
    },

    contacto: {
        type: String,
        required: [true, "El contacto es obligatorio!"],
        maxlength: [100, "El contacto debe tener un máximo de 100 caracteres!"],
    },

    estado: {
        type: Boolean,
        default: true, // Estado activo o inactivo
    },

}, {
    timestamps: true,  // Esto agregará los campos 'createdAt' y 'updatedAt' automáticamente
    versionKey: false, // Desactivar la clave __v
});

// Método para personalizar la respuesta cuando convertimos el objeto a JSON (opcional)
EmpresaSchema.methods.toJSON = function () {
    const { _v, _id, ...empresa } = this.toObject();
    empresa.uid = _id;  // Se le asigna un campo uid en lugar de _id
    return empresa;
}

export default model('Empresa', EmpresaSchema);

