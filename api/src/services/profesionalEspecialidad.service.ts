import { prisma } from "../config/prisma";

export const profesionalEspecialidadService = {
    async listar() {
        return await prisma.profesionalEspecialidad.findMany({
            orderBy: {
                id: "asc"
            }
        });
    },

    async obtenerPorId(id: number) {
        return await prisma.profesionalEspecialidad.findUnique({
            where: {
                id
            }
        });
    }
};