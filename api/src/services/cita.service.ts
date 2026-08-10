import { prisma } from "../config/prisma";
import { CreateCitaDto, UpdateCitaDto } from "../dtos/cita.dto";
import { AppError } from "../utils/app-error";

export const citaService = {
  async listar() {
    return await prisma.cita.findMany({
      include: {
        cliente: true,
        profesional: {
          include: {
            usuario: true,
            especialidades: {
              include: { especialidad: true },
            },
          },
        },
        servicio: {
          include: { categoria: true },
        },
        modalidad: true,
        estado: true,
      },
      orderBy: { fechaCita: "asc" },
    });
  },

  async obtenerPorId(id: number) {
    return await prisma.cita.findUnique({
      where: { id },
      include: {
        cliente: true,
        profesional: {
          include: {
            usuario: true,
            especialidades: {
              include: { especialidad: true },
            },
          },
        },
        servicio: {
          include: { categoria: true },
        },
        modalidad: true,
        estado: true,
        historial: true,
      },
    });
  },

  async crear(data: CreateCitaDto) {
    const estadoPendiente = await prisma.estadoCita.findFirst({
      where: { nombre: "Pendiente" },
    });

    if (!estadoPendiente) {
      throw AppError.badRequest("No existe el estado 'Pendiente' en la BD");
    }

    return prisma.cita.create({
      data: {
        idCliente: data.idCliente,
        idProfesional: data.idProfesional,
        idServicio: data.idServicio,
        idModalidad: data.idModalidad,
        idEstado: estadoPendiente.id,
        fechaCita: data.fechaCita,
        horaInicio: data.horaInicio,
        horaFin: data.horaFin,
        comentarioCliente: data.comentarioCliente,
        comentarioProfesional: data.comentarioProfesional,
        montoEstimado: data.montoEstimado,
      },
      include: {
        cliente: true,
        profesional: {
          include: {
            usuario: true,
            especialidades: {
              include: { especialidad: true },
            },
          },
        },
        servicio: {
          include: { categoria: true },
        },
        modalidad: true,
        estado: true,
      },
    });
  },

  async actualizar(id: number, data: UpdateCitaDto) {
    return prisma.cita.update({
      where: { id },
      data: {
        idCliente: data.idCliente,
        idProfesional: data.idProfesional,
        idServicio: data.idServicio,
        idModalidad: data.idModalidad,
        fechaCita: data.fechaCita,
        horaInicio: data.horaInicio,
        horaFin: data.horaFin,
        comentarioCliente: data.comentarioCliente,
        comentarioProfesional: data.comentarioProfesional,
        montoEstimado: data.montoEstimado,
      },
      include: {
        cliente: true,
        profesional: {
          include: {
            usuario: true,
            especialidades: {
              include: { especialidad: true },
            },
          },
        },
        servicio: {
          include: { categoria: true },
        },
        modalidad: true,
        estado: true,
      },
    });
  },

  async filtrarPorEstado(idEstado: number) {
    return prisma.cita.findMany({
      where: { idEstado },
      include: {
        cliente: true,
        profesional: {
          include: {
            usuario: true,
            especialidades: {
              include: { especialidad: true },
            },
          },
        },
        servicio: {
          include: { categoria: true },
        },
        modalidad: true,
        estado: true,
      },
      orderBy: { fechaCita: "asc" },
    });
  },

  async filtrarPorProfesional(idProfesional: number) {
    return prisma.cita.findMany({
      where: { idProfesional },
      include: {
        cliente: true,
        profesional: {
          include: {
            usuario: true,
            especialidades: {
              include: { especialidad: true },
            },
          },
        },
        servicio: {
          include: { categoria: true },
        },
        modalidad: true,
        estado: true,
      },
      orderBy: { fechaCita: "asc" },
    });
  },

  async filtrarPorRangoFechas(fechaInicio: Date, fechaFin: Date) {
    return prisma.cita.findMany({
      where: {
        fechaCita: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
      include: {
        cliente: true,
        profesional: {
          include: {
            usuario: true,
            especialidades: {
              include: { especialidad: true },
            },
          },
        },
        servicio: {
          include: { categoria: true },
        },
        modalidad: true,
        estado: true,
      },
      orderBy: { fechaCita: "asc" },
    });
  },
};