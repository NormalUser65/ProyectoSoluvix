import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/apiResponse.model';
import { Modalidad } from '../models/modalidad.model';

@Injectable({ providedIn: 'root' })
export class ModalidadService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/modalidad`;

  listar() {
    return this.http.get<ApiPaginatedResponse<Modalidad>>(this.apiUrl);
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<Modalidad>>(`${this.apiUrl}/${id}`);
  }

  crear(dto: { nombre: string }) {
    return this.http.post<ApiResponse<Modalidad>>(this.apiUrl, dto);
  }

  actualizar(id: number, dto: { nombre?: string }) {
    return this.http.put<ApiResponse<Modalidad>>(`${this.apiUrl}/${id}`, dto);
  }

  eliminar(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}