import { inject, Injectable } from '@angular/core';
import { IDocumentService } from './IDocumentService';
import { catchError, Observable, throwError } from 'rxjs';
import { document } from '../../models/document.model';
import { environment } from '../../../../environments/environment';
import { nameEndpints } from '../../name-enpoints/name-endpoints';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService implements IDocumentService {

  private http = inject(HttpClient);
  
  downloadFileByCode(code : string): Observable<Blob> {
    return this.http
      .get(
        `${environment.baseUrl}${nameEndpints.requestEndpoint}/document/download/${code}`,
        { responseType: 'blob' }
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
      let errorMessage = 'Algo falló. Por favor intente nuevamente.';
      return throwError(() => errorMessage);
  }

}
