import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/apiResponse.model';
import { Especialidad, EspecialidadCreateDto, EspecialidadUpdateDto } from '../models/especialidad.model';

@Injectable({ providedIn: 'root' })
export class EspecialidadService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/especialidad`;

  listar() {
    return this.http.get<ApiPaginatedResponse<Especialidad>>(this.apiUrl);
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<Especialidad>>(`${this.apiUrl}/${id}`);
  }

  crear(dto: EspecialidadCreateDto) {
    return this.http.post<ApiResponse<Especialidad>>(this.apiUrl, dto);
  }

  actualizar(id: number, dto: EspecialidadUpdateDto) {
    return this.http.put<ApiResponse<Especialidad>>(`${this.apiUrl}/${id}`, dto);
  }

  eliminar(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  cambiarEstado(id: number, estado: boolean) {
  return this.http.patch(
    `${this.apiUrl}/${id}/estado`,
    { estado }
  );
}
}