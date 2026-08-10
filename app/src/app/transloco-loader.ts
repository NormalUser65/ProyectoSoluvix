import { Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string) {
    console.log('Cargando traducciones para:', lang);
    
    const files = ['header', 'common', 'footer', 'usuarios', 'categorias', 'especialidades',
      'profesionales', 'home', 'servicio', 'crearServicio', 'crearServicio', 'detalleServicio', 
      'citas', 'detalleCita', 'crearCita', 'formularioCita', 'formularioServicio', 'editarServicio'
    ];
    const requests = files.map(file => 
      this.http.get<Translation>(`assets/i18n/${lang}/${file}.json`).pipe(
        catchError(error => {
          console.warn('No se pudo cargar', file + '.json:', error);
          return of({});
        })
      )
    );

    return forkJoin(requests).pipe(
      map((translations) => {
        console.log('Archivos cargados para', lang + ':', translations);
        const combined = translations.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        console.log('Claves combinadas para', lang + ':', Object.keys(combined));
        return combined;
      })
    );
  }
}