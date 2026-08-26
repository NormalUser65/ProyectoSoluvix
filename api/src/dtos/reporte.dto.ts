import { z } from "zod";

// Reporte de citas por estado
export const reporteCitasEstadoFiltersSchema = z.object({
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
  idProfesional: z.number().int().positive().optional(),
  idCategoria: z.number().int().positive().optional(),
});

// Reporte de citas por profesional
export const reporteCitasProfesionalFiltersSchema = z.object({
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
  idProfesional: z.number().int().positive().optional(), // Solo para ADMIN
});

// Reporte por calificación
export const reporteCalificacionesFiltersSchema = z.object({
  idProfesional: z.number().int().positive().optional(),
  umbralBajaCalificacion: z.number().min(1).max(5).default(2.5),
});

// Tipos
export type ReporteCitasEstadoFilters = z.infer<
  typeof reporteCitasEstadoFiltersSchema
>;
export type ReporteCitasProfesionalFilters = z.infer<
  typeof reporteCitasProfesionalFiltersSchema
>;
export type ReporteCalificacionesFilters = z.infer<
  typeof reporteCalificacionesFiltersSchema
>;

export interface EstadoCount {
  estado: string;
  total: number;
  porcentaje: number;
}

export interface ReporteCitasEstadoResponse {
  totalGeneral: number;
  totalPorEstado: EstadoCount[];
  filtrosAplicados: {
    fechaInicio?: string;
    fechaFin?: string;
    profesional?: string;
    categoria?: string;
  };
}

export interface ProfesionalCitasReporte {
  idProfesional: number;
  nombreProfesional: string;
  totalCitas: number;
  citasCompletadas: number;
  porcentajeFinalizacion: number;
}

export interface ReporteCitasProfesionalResponse {
  profesionales: ProfesionalCitasReporte[];
  filtrosAplicados: {
    fechaInicio?: string;
    fechaFin?: string;
  };
}

export interface ServicioCalificacion {
  idServicio: number;
  nombreServicio: string;
  promedio: number;
  totalResenas: number;
}

export interface ReporteCalificacionesResponse {
  profesional: {
    id: number;
    nombre: string;
    promedioGeneral: number;
    totalResenas: number;
  };
  mejorServicio: ServicioCalificacion | null;
  serviciosBajaCalificacion: ServicioCalificacion[];
  todosServicios: ServicioCalificacion[];
  umbralBajaCalificacion: number;
}
