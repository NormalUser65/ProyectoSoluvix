import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse.model';
import {
  ReporteCitasEstadoResponse,
  ReporteCitasEstadoFiltros,
  ReporteCitasProfesionalResponse,
  ReporteCitasProfesionalFiltros,
  ReporteCalificacionesResponse,
  ReporteCalificacionesFiltros,
} from '../models/reporte.model';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/reportes`;

  obtenerCitasPorEstado(filtros: ReporteCitasEstadoFiltros) {
    const params: any = {};

    if (filtros.fechaInicio) params.fechaInicio = filtros.fechaInicio;
    if (filtros.fechaFin) params.fechaFin = filtros.fechaFin;
    if (filtros.idProfesional) params.idProfesional = filtros.idProfesional;
    if (filtros.idCategoria) params.idCategoria = filtros.idCategoria;

    return this.http.get<ApiResponse<ReporteCitasEstadoResponse>>(`${this.apiUrl}/citas/estado`, {
      params,
    });
  }

  obtenerCitasPorProfesional(filtros: ReporteCitasProfesionalFiltros) {
    const params: any = {};

    if (filtros.fechaInicio) params.fechaInicio = filtros.fechaInicio;
    if (filtros.fechaFin) params.fechaFin = filtros.fechaFin;
    if (filtros.idProfesional) params.idProfesional = filtros.idProfesional;

    return this.http.get<ApiResponse<ReporteCitasProfesionalResponse>>(
      `${this.apiUrl}/citas/profesional`,
      { params },
    );
  }

  obtenerCalificaciones(filtros: ReporteCalificacionesFiltros) {
    const params: any = {};

    if (filtros.idProfesional) params.idProfesional = filtros.idProfesional;
    if (filtros.umbralBajaCalificacion)
      params.umbralBajaCalificacion = filtros.umbralBajaCalificacion;

    return this.http.get<ApiResponse<ReporteCalificacionesResponse>>(
      `${this.apiUrl}/calificaciones`,
      { params },
    );
  }
}
