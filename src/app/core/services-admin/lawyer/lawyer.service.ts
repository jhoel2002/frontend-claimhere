import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Lawyer } from '../../models/lawyer.model';
import { Page } from '../../models/pageable.model';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { nameEndpints } from '../../name-enpoints/name-endpoints';
import { ILawyerService } from './ILawyer.service';
import { AUTH_SERVICE_TOKEN } from '../../models/token-injection.model';

@Injectable({
  providedIn: 'root'
})
export class LawyerService implements ILawyerService {

  private http = inject(HttpClient);
  private authService = inject(AUTH_SERVICE_TOKEN)
  
  codebuffet: string = this.authService.userBuffet;

  getAll(page: number, size: number): Observable<Page<Lawyer>> {
    const params = new HttpParams().set('page', page.valueOf()).set('size', size.valueOf());
    const url: string = `${environment.baseUrl}${nameEndpints.lawyerEndpoint}/${this.codebuffet}`;
      return this.http.get<any>(url, {params: params})
        .pipe(catchError(this.handleError));
  }

  getLawyersBysearch(searchText: string, page: number, size: number): Observable<Page<Lawyer>> {
    const params = new HttpParams().set('search', searchText).set('page', page.valueOf()).set('size', size.valueOf());
    const url: string = `${environment.baseUrl}${nameEndpints.lawyerEndpoint}/listFilterSearch/${this.codebuffet}`;
      return this.http.get<any>(url, { params })
        .pipe(catchError(this.handleError));
  }

  getLawyersByDateRange(start: string, end: string, page: number, size: number): Observable<Page<Lawyer>> {
    const params = new HttpParams().set('startDate', start).set('endDate', end).set('page', page.valueOf()).set('size', size.valueOf());
    const url: string = `${environment.baseUrl}${nameEndpints.lawyerEndpoint}/listFilterCreationDate/${this.codebuffet}`;
      return this.http.get<any>(url, { params })
        .pipe(catchError(this.handleError));
  }

  getLawyersBySearchAndDate(searchText: string, start: string, end: string, page: number, size: number): Observable<Page<Lawyer>> {
    const params = new HttpParams().set('search', searchText).set('startDate', start).set('endDate', end).set('page', page.valueOf()).set('size', size.valueOf());
    const url: string = `${environment.baseUrl}${nameEndpints.lawyerEndpoint}/listFilterFull/${this.codebuffet}`;
      return this.http.get<any>(url, { params })
        .pipe(catchError(this.handleError));
  }

  // lawyer.service.ts
  register(lawyerData: Lawyer): Observable<any> {
    // 1.  Arma el FormData
    const fd = new FormData();
    fd.append('email',       lawyerData.email);
    fd.append('name',        lawyerData.name);
    fd.append('last_name',   lawyerData.last_name);
    fd.append('password',    lawyerData.password!);
    fd.append('phone',       lawyerData.phone);
    fd.append('address',     lawyerData.address);
    fd.append('case_type',   lawyerData.case_type);
    fd.append('description', lawyerData.description!);
    fd.append('foto',        lawyerData.foto!, lawyerData.foto!.name);

    const url = `${environment.baseUrl}${nameEndpints.lawyerEndpoint}/save/${this.codebuffet}`;
    return this.http.post<any>(url, fd).pipe(
      catchError(this.handleError)
    );
  }

  update(codeLawyer: string, userData: Lawyer): Observable<any>{
    return this.http
      .put<any>(
        `${environment.baseUrl}${nameEndpints.lawyerEndpoint}/updateLawyer/${codeLawyer}`,userData)
      .pipe(catchError(this.handleError));
  }

  searchLawyers(query: string, typeCase: string): Observable<any> {
    const params = new HttpParams()
      .set('search', query.toString())
      .set('typeCase', typeCase.toString())
    const url: string = `${environment.baseUrl}${nameEndpints.lawyerEndpoint}/simple/${this.codebuffet}`;
    return this.http.get<Page<Lawyer>>(url, {params}).pipe(catchError(this.handleError));
  }

  disabled(code: string, enable: boolean): Observable<any>{
    return this.http
      .patch<any>(
        `${environment.baseUrl}${nameEndpints.usuarioEndpoint}/enable`, { code, enable })
      .pipe(catchError(this.handleError));
  }

  delete(code: string): Observable<any>{
    return this.http
      .delete<any>(
        `${environment.baseUrl}${nameEndpints.lawyerEndpoint}/delete/${code}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error:HttpErrorResponse){
    let errorMessage = 'Algo falló. Por favor intente nuevamente.';
    if (error.status === 403) {
      errorMessage ='Contraseña actual incorrecta';
    }
    if (error.status === 409) {
      errorMessage ='El correo ya está registrado en el sistema.';
    }
    if (error.status === 422) {
      errorMessage ='El correo o documento ya está registrado. Si ya es cliente y desea asignarlo como empleado o administrador, actualice su rol en la seccion Clientes';
    }
    return throwError(() => errorMessage);
  }

}
