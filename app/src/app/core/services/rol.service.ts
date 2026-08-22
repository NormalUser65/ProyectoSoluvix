import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/apiResponse.model';
import { Rol } from '../models/rol.model';

@Injectable({
    providedIn: 'root',
})
export class RolService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/rol`;

    listar(): Observable<Rol[]> {
        return this.http
        .get<ApiResponse<Rol[]>>(this.apiUrl)
        .pipe(
            map((response) => response.data ?? [])
        );
    }
}