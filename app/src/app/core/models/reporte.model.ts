export interface EstadoCount {
  estado: string;
  total: number;
  porcentaje: number;
}

export interface ReporteCitasEstadoFiltros {
  fechaInicio?: string;
  fechaFin?: string;
  idProfesional?: number;
  idCategoria?: number;
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

export interface ReporteCitasProfesionalFiltros {
  fechaInicio?: string;
  fechaFin?: string;
  idProfesional?: number;
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

export interface ReporteCalificacionesFiltros {
  idProfesional?: number;
  umbralBajaCalificacion?: number;
}
