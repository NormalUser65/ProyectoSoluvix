import { prisma } from "../config/prisma";

export const historialEstadoCitaService = {
    async listar() {
        return await prisma.historialEstadoCita.findMany({
            orderBy: {
                fechaCambio: "desc"
            }
        });
    },

    async obtenerPorId(id: number) {
        return await prisma.historialEstadoCita.findUnique({
            where: {
                id
            }
        });
    }
};