import { prisma } from "../config/prisma";

export const modalidadService = {
    async listar() {
        return await prisma.modalidad.findMany({
            orderBy: {
                nombre: "asc"
            }
        });
    },

    async obtenerPorId(id: number) {
        return await prisma.modalidad.findUnique({
            where: { id }
        });
    }
};