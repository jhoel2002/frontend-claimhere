import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { nameEndpints } from '../../name-enpoints/name-endpoints';

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {
  constructor(private http: HttpClient) {}
  downloadFile(evidenceId: number): Observable<Blob> {
    return this.http
      .get(
        `${environment.baseUrl}${nameEndpints.evidenceEndpoint}/descargarEvidenciaById/${evidenceId}`,
        { responseType: 'blob' }
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Algo falló. Por favor intente nuevamente.';
    return throwError(() => errorMessage);
  }
}
