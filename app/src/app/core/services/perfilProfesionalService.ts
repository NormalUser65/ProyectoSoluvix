import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/apiResponse.model';
import { PerfilProfesional, PerfilProfesionalCreateDto, PerfilProfesionalUpdateDto } from '../models/perfilProfesional.model';

@Injectable({ providedIn: 'root' })
export class PerfilProfesionalService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/profesionales`;

  listar() {
    return this.http.get<ApiPaginatedResponse<PerfilProfesional>>(this.apiUrl);
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<PerfilProfesional>>(`${this.apiUrl}/${id}`);
  }

  crear(dto: PerfilProfesionalCreateDto) {
    return this.http.post<ApiResponse<PerfilProfesional>>(this.apiUrl, dto);
  }

  actualizar(id: number, dto: PerfilProfesionalUpdateDto) {
    return this.http.put<ApiResponse<PerfilProfesional>>(`${this.apiUrl}/${id}`, dto);
  }

  getImageUrl(imageName: string): string {
    return `${environment.imageUrl}/${imageName}`;
  }
}