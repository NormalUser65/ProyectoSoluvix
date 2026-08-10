import { prisma } from "../config/prisma";

export const estadoCitaService = {
    async listar() {
        return await prisma.estadoCita.findMany({
            orderBy: {
                id: "asc"
            }
        });
    },

    async obtenerPorId(id: number) {
        return await prisma.estadoCita.findUnique({
            where: { id }
        });
    }
};