import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";

export const resenaService = {
  async listar() {
    return await prisma.resena.findMany({
      include: {
        cliente: true,
        profesional: { include: { usuario: true } },
        cita: true,
      },
      orderBy: { fechaResenna: "desc" },
    });
  },

  async obtenerPorId(id: number) {
    return await prisma.resena.findUnique({
      where: { id },
      include: {
        cliente: true,
        profesional: { include: { usuario: true } },
        cita: true,
      },
    });
  },

  async obtenerPorProfesional(idProfesional: number) {
    return await prisma.resena.findMany({
      where: { idProfesional },
      include: {
        cliente: true,
        profesional: { include: { usuario: true } },
        cita: true,
      },
      orderBy: { fechaResenna: "desc" },
    });
  },

  async obtenerPorCita(idCita: number) {
    return await prisma.resena.findUnique({
      where: { idCita },
      include: {
        cliente: true,
        profesional: { include: { usuario: true } },
        cita: true,
      },
    });
  },

  async crear(
    idCita: number,
    idCliente: number,
    puntuacion: number,
    comentario?: string,
  ) {
    const cita = await prisma.cita.findUnique({
      where: { id: idCita },
      include: { estado: true, profesional: true },
    });

    if (!cita) {
      throw AppError.notFound("Cita no encontrada");
    }

    const estadoNormalizado = cita.estado.nombre.toUpperCase().trim();
    if (estadoNormalizado !== "COMPLETADA") {
      throw AppError.badRequest(
        "Solo se puede registrar reseña en citas completadas",
      );
    }

    if (cita.idCliente !== idCliente) {
      throw AppError.badRequest("El cliente no corresponde a la cita");
    }

    const existente = await prisma.resena.findUnique({ where: { idCita } });
    if (existente) {
      throw AppError.badRequest("Ya existe una reseña para esta cita");
    }

    return prisma.resena.create({
      data: {
        idCita,
        idCliente,
        idProfesional: cita.idProfesional,
        puntuacion,
        comentario,
      },
      include: {
        cliente: true,
        profesional: { include: { usuario: true } },
        cita: true,
      },
    });
  },
};