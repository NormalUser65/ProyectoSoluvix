import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/apiResponse.model';
import { Categoria } from '../models/categoria.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/categoria`;

  listar() {
    return this.http.get<ApiPaginatedResponse<Categoria>>(this.apiUrl);
  }
  cambiarEstado(id: number, estado: boolean) {
  return this.http.patch(
    `${this.apiUrl}/${id}/estado`,
    { estado }
  );
}

}
