import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { nameEndpints } from '../../name-enpoints/name-endpoints';
import { Page } from '../../models/pageable.model';
import { IRequestService } from './IRequest.service';
import { CaseRequest } from '../../models/case-request.model';
// import { CaseRequestFull } from '../../models/case-request-full.model';
import { AUTH_SERVICE_TOKEN } from '../../models/token-injection.model';
import { Task } from '../../models/task.model';
import { document } from '../../models/document.model';
type Status = 'APPROVED' | 'REJECTED' | 'PENDING';

@Injectable({
  providedIn: 'root'
})
export class RequestService implements IRequestService {

  private http = inject(HttpClient);

  private authService = inject(AUTH_SERVICE_TOKEN)

  codebuffet: string = this.authService.userBuffet;

  updateStatusWithLawyer(code: string, selectedLawyerCode: string):Observable<any> {
    const body ={
      code: code,
      lawyer: selectedLawyerCode
    }
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/assignLawyer`;
    return this.http.patch(url, body).pipe(catchError(this.handleError));
  }

  updateStatusWithCotization(code: string, cotization: document):Observable<any> {
    const formData = new FormData();
    if (cotization.document && cotization.type_document) {
      formData.append('files', cotization.document);
      formData.append('typeDocument', cotization.type_document);
      formData.append('codeCaseRequest', code);
    }
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/carryDocument`;
    return this.http.post(url,formData).pipe(catchError(this.handleError));
  }

  updateStatus(code: string, status: string): Observable<any> {
    const body ={
      code: code,
      status_request: status
    }
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/updateStatus`;
    return this.http.patch(url, body).pipe(catchError(this.handleError));
  }

  getRequestByCode(code: string): Observable<CaseRequest> {
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/info/${code}`;
    return this.http.get<CaseRequest>(url).pipe(catchError(this.handleError));
  }

  getRequestView(code: string): Observable<Partial<CaseRequest>>{
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/info/${code}`;
    return this.http.get<Partial<CaseRequest>>(url).pipe(catchError(this.handleError));
  }

  getAll(page: number, size: number): Observable<Page<CaseRequest>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'asc');
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/${this.codebuffet}`;
    return this.http.get<Page<CaseRequest>>(url, { params }).pipe(catchError(this.handleError));
  }

  getRequestsByStatus(page: number, size: number, status: Status, lawyerCode?: string): Observable<Page<CaseRequest>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'asc')
      .set('status', status)
      .set('lawyer', lawyerCode || '');
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/listFilterStatus/${this.codebuffet}`;
    return this.http.get<Page<CaseRequest>>(url, { params }).pipe(catchError(this.handleError));
  }

  getRequestsBySearch(searchText: string, page: number, size: number, status: Status, lawyerCode?: string): Observable<Page<CaseRequest>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'asc')
      .set('search', searchText)
      .set('status', status)
      .set('lawyer', lawyerCode || '');
    const url: string = `${environment.baseUrl}${nameEndpints.requestEndpoint}/listFilterSearch/${this.codebuffet}`;
    return this.http.get<Page<CaseRequest>>(url, { params })
      .pipe(catchError(this.handleError));
  }

  getRequestsByDateRange(start: string, end: string, page: number, size: number, status: Status, lawyerCode?: string): Observable<Page<CaseRequest>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'asc')
      .set('startDate', start)
      .set('endDate', end)
      .set('status', status)
      .set('lawyer', lawyerCode || '');
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/listFilterApplicationDate/${this.codebuffet}`;
    return this.http.get<Page<CaseRequest>>(url, { params }).pipe(catchError(this.handleError));
  }

  getRequestsBySearchAndDate(searchText: string, start: string, end: string, page: number, size: number, status: Status, lawyerCode?: string): Observable<Page<CaseRequest>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'asc')
      .set('search', searchText)
      .set('startDate', start)
      .set('endDate', end)
      .set('status', status)
      .set('lawyer', lawyerCode || '');
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/listFilterFull/${this.codebuffet}`;
    return this.http.get<Page<CaseRequest>>(url, { params }).pipe(catchError(this.handleError));
  }

  register(codeCustomer: string, codeLawyer: string, requestData: CaseRequest, evidencias: File[], cotizacion: File): Observable<any> {
    const formData = new FormData();

    // Campos de texto
    formData.append('title', requestData.title);
    formData.append('description', requestData.description!);
    formData.append('type_case', requestData.type_case);
    formData.append('lawyer', codeLawyer);

    evidencias.forEach(file => formData.append('evidencia', file, file.name));
    formData.append('cotizacion', cotizacion);

    // Construir URL con codeCustomer
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/saveEvidenceMassive/${codeCustomer}`;

    return this.http.post<any>(url, formData).pipe(
      catchError(this.handleError)
    );
  }

  registerResolution(code: string, resolution: document): Observable<any> {
    const formData = new FormData();
    if (resolution.document && resolution.type_document) {
      formData.append('files', resolution.document);
      formData.append('typeDocument', resolution.type_document);
      formData.append('codeCaseRequest', code);
    }
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/saveResolution`;

    return this.http.post<any>(url, formData).pipe(
      catchError(this.handleError)
    );
  }

  getTasksByRequestCode(code: string): Observable<any> {
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/getTaskByRequest/${code}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  addTaskToRequest(code: string, newTask: Task): Observable<any> {
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/addTaskToRequest/${code}`;
    return this.http.post<any>(url,newTask).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Algo falló. Por favor intente nuevamente.';
    return throwError(() => new Error(errorMessage));
  }
}
