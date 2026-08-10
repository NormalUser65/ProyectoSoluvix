import { prisma } from "../config/prisma";

export const servicioEspecialidadService = {
    async listar() {
        return await prisma.servicioEspecialidad.findMany({
            orderBy: {
                id: "asc"
            }
        });
    },

    async obtenerPorId(id: number) {
        return await prisma.servicioEspecialidad.findUnique({
            where: {
                id
            }
        });
    }
};