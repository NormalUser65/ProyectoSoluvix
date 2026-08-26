import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse.model';
import { Resena, CreateResenaDto } from '../models/resena.model';

@Injectable({
  providedIn: 'root'
})
export class ResenaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/resenas`;

  listar() {
    return this.http.get<ApiResponse<Resena[]>>(this.apiUrl);
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<Resena>>(`${this.apiUrl}/${id}`);
  }

  crear(dto: CreateResenaDto) {
    return this.http.post<ApiResponse<Resena>>(this.apiUrl, dto);
  }

  obtenerPorProfesional(idProfesional: number) {
    return this.http.get<ApiResponse<Resena[]>>(`${this.apiUrl}/profesional/${idProfesional}`);
  }

  obtenerPorCita(idCita: number) {
    return this.http.get<ApiResponse<Resena>>(`${this.apiUrl}/cita/${idCita}`);
  }
}