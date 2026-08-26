import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';

import { ApiResponse } from '../models/apiResponse.model';
import { EstadoCita } from '../models/estadoCita.model';

@Injectable({
    providedIn: 'root',
})
    export class EstadoCitaService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl =
        `${environment.apiUrl}/estadoCita`;

    listar(): Observable<ApiResponse<EstadoCita[]>> {
        return this.http.get<ApiResponse<EstadoCita[]>>(
        this.apiUrl
        );
    }
}