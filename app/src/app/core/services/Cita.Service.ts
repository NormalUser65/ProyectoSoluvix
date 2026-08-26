import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';

import {
  ApiPaginatedResponse,
  ApiResponse
} from '../models/apiResponse.model';

import {
  Cita,
  CitaCreateDto
} from '../models/cita.model';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/cita`;

  listar() {
    return this.http.get<ApiPaginatedResponse<Cita>>(
      this.apiUrl
    );
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<Cita>>(
      `${this.apiUrl}/${id}`
    );
  }

  crear(data: CitaCreateDto) {
    return this.http.post<ApiResponse<Cita>>(
      this.apiUrl,
      data
    );
  }

  misCitas(
  idEstado?: number,
  fechaInicio?: string,
  fechaFin?: string
) {
  const params: Record<string, string> = {};

  if (idEstado) {
    params['idEstado'] =
      String(idEstado);
  }

  if (fechaInicio) {
    params['fechaInicio'] =
      fechaInicio;
  }

  if (fechaFin) {
    params['fechaFin'] =
      fechaFin;
  }

  return this.http.get<ApiResponse<Cita[]>>(
    `${this.apiUrl}/mis-citas`,
    {
      params
    }
  );
}

  obtenerMiCitaPorId(
    id: number
  ): Observable<ApiResponse<Cita>> {
    return this.http.get<ApiResponse<Cita>>(
      `${this.apiUrl}/mis-citas/${id}`
    );
  }
}