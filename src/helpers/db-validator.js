import User from '../users/user.model.js';
import Empresa from '../empresas/empresa.model.js';

export const empresaExiste = async (id = '') => {
    const existeEmpresa = await Empresa.findById(id);

    if (!existeEmpresa) {
        throw new Error(`La empresa con id ${id} no existe!`);
    }
};
export const esRoleValido = (role = '') => {
    if (role !== 'ADMIN_ROLE') {
        throw new Error('Solo los administradores pueden acceder al sistema.');
    }
    return true;
};

export const existenteEmail = async (email = ' ') => {
    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
        throw new Error(`Email ${email} exists in the database!`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);

    if (!existeUsuario) {
        throw new Error(`id ${id} does not exist!`);
    }
}