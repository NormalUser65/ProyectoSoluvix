import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import {
  ReporteCitasEstadoResponse,
  ReporteCitasProfesionalResponse,
  ReporteCalificacionesResponse,
  ReporteCitasEstadoFilters,
  ReporteCitasProfesionalFilters,
  ReporteCalificacionesFilters,
  ProfesionalCitasReporte,
  EstadoCount,
  ServicioCalificacion,
} from "../dtos/reporte.dto";

export const reporteService = {
  async obtenerCitasPorEstado(
    filters: ReporteCitasEstadoFilters,
  ): Promise<ReporteCitasEstadoResponse> {
    const { fechaInicio, fechaFin, idProfesional, idCategoria } = filters;

    const where: any = {};

    if (fechaInicio) {
      where.fechaCita = { ...where.fechaCita, gte: new Date(fechaInicio) };
    }
    if (fechaFin) {
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59, 999);
      where.fechaCita = { ...where.fechaCita, lte: fin };
    }
    if (idProfesional) {
      where.idProfesional = idProfesional;
    }
    if (idCategoria) {
      where.servicio = { idCategoria };
    }

    const citas = await prisma.cita.findMany({
      where,
      include: {
        estado: true,
        profesional: { include: { usuario: true } },
        servicio: { include: { categoria: true } },
      },
    });

    const estadoMap = new Map<string, number>();
    const estados = [
      "PENDIENTE",
      "ACEPTADA",
      "RECHAZADA",
      "CANCELADA",
      "COMPLETADA",
    ];
    estados.forEach((e) => estadoMap.set(e, 0));

    citas.forEach((cita) => {
      const nombre = cita.estado.nombre.toUpperCase();
      if (estadoMap.has(nombre)) {
        estadoMap.set(nombre, (estadoMap.get(nombre) || 0) + 1);
      }
    });

    const totalGeneral = citas.length;
    const totalPorEstado: EstadoCount[] = estados.map((estado) => ({
      estado,
      total: estadoMap.get(estado) || 0,
      porcentaje:
        totalGeneral > 0
          ? Math.round(((estadoMap.get(estado) || 0) / totalGeneral) * 100)
          : 0,
    }));

    let profesionalNombre: string | undefined;
    if (idProfesional) {
      const prof = await prisma.perfilProfesional.findUnique({
        where: { id: idProfesional },
        include: { usuario: true },
      });
      profesionalNombre = prof
        ? `${prof.usuario.nombre} ${prof.usuario.apellidos}`
        : undefined;
    }

    let categoriaNombre: string | undefined;
    if (idCategoria) {
      const cat = await prisma.categoria.findUnique({
        where: { id: idCategoria },
      });
      categoriaNombre = cat?.nombre;
    }

    return {
      totalGeneral,
      totalPorEstado,
      filtrosAplicados: {
        fechaInicio: filters.fechaInicio,
        fechaFin: filters.fechaFin,
        profesional: profesionalNombre,
        categoria: categoriaNombre,
      },
    };
  },

  async obtenerCitasPorProfesional(
    filters: ReporteCitasProfesionalFilters,
    usuarioId: number,
    usuarioRol: string,
  ): Promise<ReporteCitasProfesionalResponse> {
    const { fechaInicio, fechaFin, idProfesional } = filters;

    let profesionalIds: number[] = [];

    if (usuarioRol === "PROFESIONAL") {
      const perfil = await prisma.perfilProfesional.findUnique({
        where: { idUsuario: usuarioId },
      });
      if (!perfil) {
        throw AppError.notFound("Perfil profesional no encontrado");
      }
      profesionalIds = [perfil.id];
    } else if (usuarioRol === "ADMIN") {
      if (idProfesional) {
        profesionalIds = [idProfesional];
      } else {
        const perfiles = await prisma.perfilProfesional.findMany({
          select: { id: true },
        });
        profesionalIds = perfiles.map((p) => p.id);
      }
    } else {
      throw AppError.forbidden("No tiene permisos para acceder a este reporte");
    }

    const where: any = {
      idProfesional: { in: profesionalIds },
    };

    if (fechaInicio) {
      where.fechaCita = { ...where.fechaCita, gte: new Date(fechaInicio) };
    }
    if (fechaFin) {
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59, 999);
      where.fechaCita = { ...where.fechaCita, lte: fin };
    }

    const citas = await prisma.cita.findMany({
      where,
      include: {
        profesional: { include: { usuario: true } },
        estado: true,
      },
    });

    const profesionalMap = new Map<
      number,
      { total: number; completadas: number; nombre: string }
    >();

    citas.forEach((cita) => {
      const id = cita.idProfesional;
      if (!profesionalMap.has(id)) {
        profesionalMap.set(id, {
          total: 0,
          completadas: 0,
          nombre: `${cita.profesional.usuario.nombre} ${cita.profesional.usuario.apellidos}`,
        });
      }
      const data = profesionalMap.get(id)!;
      data.total += 1;
      if (cita.estado.nombre.toUpperCase() === "COMPLETADA") {
        data.completadas += 1;
      }
    });

    const profesionales: ProfesionalCitasReporte[] = Array.from(
      profesionalMap.entries(),
    ).map(([id, data]) => ({
      idProfesional: id,
      nombreProfesional: data.nombre,
      totalCitas: data.total,
      citasCompletadas: data.completadas,
      porcentajeFinalizacion:
        data.total > 0 ? Math.round((data.completadas / data.total) * 100) : 0,
    }));

    profesionales.sort((a, b) => b.totalCitas - a.totalCitas);

    return {
      profesionales,
      filtrosAplicados: {
        fechaInicio: filters.fechaInicio,
        fechaFin: filters.fechaFin,
      },
    };
  },

  async obtenerCalificaciones(
    filters: ReporteCalificacionesFilters,
    usuarioId: number,
    usuarioRol: string,
  ): Promise<ReporteCalificacionesResponse> {
    const { idProfesional, umbralBajaCalificacion = 2.5 } = filters;

    let profesionalId: number | undefined = idProfesional;

    if (usuarioRol === "PROFESIONAL") {
      const perfil = await prisma.perfilProfesional.findUnique({
        where: { idUsuario: usuarioId },
      });
      if (!perfil) {
        throw AppError.notFound("Perfil profesional no encontrado");
      }
      profesionalId = perfil.id;
    } else if (usuarioRol === "ADMIN" && !idProfesional) {
      // 👈 Si es ADMIN y no especifica, obtener el primer profesional con reseñas
      const primerProfesionalConResenas = await prisma.resena.findFirst({
        select: { idProfesional: true },
        distinct: ["idProfesional"],
        orderBy: { idProfesional: "asc" },
      });

      if (!primerProfesionalConResenas) {
        // Si no hay reseñas, obtener el primer profesional de la base de datos
        const primerProfesional = await prisma.perfilProfesional.findFirst({
          include: { usuario: true },
        });
        if (!primerProfesional) {
          throw AppError.notFound("No hay profesionales registrados");
        }
        profesionalId = primerProfesional.id;
      } else {
        profesionalId = primerProfesionalConResenas.idProfesional;
      }
    }

    if (!profesionalId) {
      throw AppError.badRequest("Debe especificar un profesional");
    }

    // Obtener el profesional
    const profesional = await prisma.perfilProfesional.findUnique({
      where: { id: profesionalId },
      include: { usuario: true },
    });
    if (!profesional) {
      throw AppError.notFound("Profesional no encontrado");
    }

    // Obtener reseñas del profesional
    const resenas = await prisma.resena.findMany({
      where: { idProfesional: profesionalId },
      include: { cita: { include: { servicio: true } } },
    });

    // Calcular promedio general
    const totalResenas = resenas.length;
    const promedioGeneral =
      totalResenas > 0
        ? Math.round(
            (resenas.reduce((sum, r) => sum + r.puntuacion, 0) / totalResenas) *
              10,
          ) / 10
        : 0;

    // Calcular por servicio
    const servicioMap = new Map<
      number,
      { nombre: string; total: number; suma: number }
    >();

    resenas.forEach((resena) => {
      const servicioId = resena.cita.idServicio;
      const servicioNombre = resena.cita.servicio.nombre;
      if (!servicioMap.has(servicioId)) {
        servicioMap.set(servicioId, {
          nombre: servicioNombre,
          total: 0,
          suma: 0,
        });
      }
      const data = servicioMap.get(servicioId)!;
      data.total += 1;
      data.suma += resena.puntuacion;
    });

    const serviciosCalificados: ServicioCalificacion[] = Array.from(
      servicioMap.entries(),
    ).map(([id, data]) => ({
      idServicio: id,
      nombreServicio: data.nombre,
      promedio: Math.round((data.suma / data.total) * 10) / 10,
      totalResenas: data.total,
    }));

    // Mejor servicio
    const mejorServicio =
      serviciosCalificados.length > 0
        ? serviciosCalificados.reduce((a, b) =>
            a.promedio > b.promedio ? a : b,
          )
        : null;

    // Servicios con baja calificación
    const serviciosBajaCalificacion = serviciosCalificados
      .filter((s) => s.promedio < umbralBajaCalificacion)
      .sort((a, b) => a.promedio - b.promedio);

    return {
      profesional: {
        id: profesional.id,
        nombre: `${profesional.usuario.nombre} ${profesional.usuario.apellidos}`,
        promedioGeneral,
        totalResenas,
      },
      mejorServicio,
      serviciosBajaCalificacion,
      todosServicios: serviciosCalificados.sort(
        (a, b) => b.promedio - a.promedio,
      ),
      umbralBajaCalificacion,
    };
  },
};
