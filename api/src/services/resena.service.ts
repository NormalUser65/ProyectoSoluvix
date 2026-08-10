import { prisma } from "../config/prisma";

export const resenaService = {
    async listar() {
        return await prisma.resena.findMany({
            include: {
                cliente: true,
                profesional: {
                    include: {
                        usuario: true
                    }
                },
                cita: true
            },
            orderBy: {
                fechaResenna: "desc"
            }
        });
    },

    async obtenerPorId(id: number) {
        return await prisma.resena.findUnique({
            where: { id },
            include: {
                cliente: true,
                profesional: {
                    include: {
                        usuario: true
                    }
                },
                cita: true
            }
        });
    }
};