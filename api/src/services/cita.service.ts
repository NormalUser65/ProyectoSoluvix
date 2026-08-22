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

    // Validar servicio
    const servicio = await prisma.servicio.findUnique({
      where: { id: data.idServicio },
      include: { perfil: true },
    });
    if (!servicio || !servicio.estado) {
      throw AppError.badRequest("El servicio seleccionado no está activo");
    }

    // Validar profesional
    if (!servicio.perfil.disponible) {
      throw AppError.badRequest("El profesional no está disponible");
    }

    // Validar fecha futura
    if (data.horaInicio <= new Date()) {
      throw AppError.badRequest("La cita debe ser en una fecha futura");
    }

    // Calcular hora fin
    const horaFinCalculada = new Date(data.horaInicio);
    horaFinCalculada.setMinutes(
      horaFinCalculada.getMinutes() + servicio.duracionEstimada,
    );

    // Validar traslape
    const traslape = await prisma.cita.findFirst({
      where: {
        idProfesional: data.idProfesional,
        horaInicio: { lt: horaFinCalculada },
        horaFin: { gt: data.horaInicio },
        idEstado: {
          notIn: [
            /* Cancelada, Rechazada */
          ],
        },
      },
    });
    if (traslape) {
      throw AppError.badRequest(
        "El profesional ya tiene una cita en ese horario",
      );
    }

    // Calcular monto estimado
    const montoEstimado = servicio.precio;

    // Crear cita
    return prisma.cita.create({
      data: {
        idCliente: data.idCliente,
        idProfesional: data.idProfesional,
        idServicio: data.idServicio,
        idModalidad: data.idModalidad,
        idEstado: estadoPendiente.id,
        fechaCita: data.fechaCita,
        horaInicio: data.horaInicio,
        horaFin: horaFinCalculada,
        comentarioCliente: data.comentarioCliente,
        comentarioProfesional: data.comentarioProfesional,
        montoEstimado,
      },
      include: {
        cliente: true,
        profesional: { include: { usuario: true } },
        servicio: { include: { categoria: true } },
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

  async cambiarEstado(
    idCita: number,
    nuevoEstado: string,
    actor: "cliente" | "profesional",
    comentario?: string,
  ) {
    const cita = await prisma.cita.findUnique({
      where: { id: idCita },
      include: { estado: true },
    });
    if (!cita) throw AppError.notFound("Cita no encontrada");

    const estadoActual = cita.estado.nombre;

    // Estados finales: no permiten cambios
    if (["Rechazada", "Cancelada", "Completada"].includes(estadoActual)) {
      throw AppError.badRequest(
        `La cita ya está en estado final: ${estadoActual}`,
      );
    }

    // Lógica de matriz por probar con los permisos de usuarios
    if (
      estadoActual === "Pendiente" &&
      nuevoEstado === "Aceptada" &&
      actor === "profesional"
    ) {
    } else if (
      estadoActual === "Pendiente" &&
      nuevoEstado === "Rechazada" &&
      actor === "profesional"
    ) {
      if (!comentario)
        throw AppError.badRequest("Motivo obligatorio al rechazar");
    } else if (
      estadoActual === "Pendiente" &&
      nuevoEstado === "Cancelada" &&
      actor === "cliente"
    ) {
      if (!comentario)
        throw AppError.badRequest("Motivo obligatorio al cancelar");
    } else if (
      estadoActual === "Aceptada" &&
      nuevoEstado === "Completada" &&
      actor === "profesional"
    ) {
      if (new Date() < cita.horaFin) {
        throw AppError.badRequest(
          "Solo se puede completar después de la hora programada",
        );
      }
    } else if (
      estadoActual === "Aceptada" &&
      nuevoEstado === "Cancelada" &&
      ["cliente", "profesional"].includes(actor)
    ) {
      if (!comentario)
        throw AppError.badRequest("Motivo obligatorio al cancelar");
    } else {
      throw AppError.badRequest(
        `Transición no permitida: ${estadoActual} → ${nuevoEstado}`,
      );
    }

    // Buscar id del nuevo estado
    const estadoNuevo = await prisma.estadoCita.findFirst({
      where: { nombre: nuevoEstado },
    });
    if (!estadoNuevo)
      throw AppError.badRequest("Estado destino no existe en BD");

    // Actualizar cita
    const citaActualizada = await prisma.cita.update({
      where: { id: idCita },
      data: {
        idEstado: estadoNuevo.id,
        comentarioProfesional:
          actor === "profesional" ? comentario : cita.comentarioProfesional,
        comentarioCliente:
          actor === "cliente" ? comentario : cita.comentarioCliente,
      },
      include: { estado: true },
    });

    // Registrar historial
    await prisma.historialEstadoCita.create({
      data: {
        idCita: cita.id,
        idEstadoAnterior: cita.idEstado,
        idEstadoNuevo: estadoNuevo.id,
        comentario,
      },
    });

    return citaActualizada;
  },
};
