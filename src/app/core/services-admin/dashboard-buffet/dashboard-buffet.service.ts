import { inject, Injectable } from '@angular/core';
import { IDashboardBuffet } from './IDashboard-buffet.service';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardBuffetService implements IDashboardBuffet{

  http = inject(HttpClient);

  // 1. Monitorear flujo de casos por estado

  getCasesByStatus(from?: string, to?: string): Observable<any> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get('/api/dashboard/cases-by-status', { params }).pipe(catchError(this.handleError));
  }

  // 2. Carga laboral por abogado y buffet

  getCasesByLawyer(from?: string, to?: string): Observable<any> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get('/api/dashboard/cases-by-lawyer', { params }).pipe(catchError(this.handleError));
  }

  getCasesByTypeCase(from?: string, to?: string): Observable<any> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get('/api/dashboard/cases-by-type-case', { params }).pipe(catchError(this.handleError));
  }

  getCasesForMonth(from?: string, to?: string): Observable<any> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get('/api/dashboard/cases-by-month', { params }).pipe(catchError(this.handleError));
  }

  getCasesMetrics(from?: string, to?: string): Observable<any>{
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get('/api/dashboard/cases-metrics', { params }).pipe(catchError(this.handleError));
  }

  // 3. Supervisar tiempos de atención y resolución

  getAvgResolutionTimeByLawyer(from?: string, to?: string, buffetId?: number): Observable<any> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    if (buffetId) params = params.set('buffetId', buffetId.toString());
    return this.http.get('/api/dashboard/avg-resolution-time/by-lawyer', { params }).pipe(catchError(this.handleError));
  }

  getAvgStageTime(stage: string, from?: string, to?: string): Observable<any> {
    let params = new HttpParams().set('stage', stage);
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get('/api/dashboard/avg-stage-time', { params }).pipe(catchError(this.handleError));
  }

  // 4. Desempeño de abogados y buffets

  getPerformanceByLawyer(from?: string, to?: string, buffetId?: number): Observable<any> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    if (buffetId) params = params.set('buffetId', buffetId.toString());
    return this.http.get('/api/dashboard/performance/by-lawyer', { params }).pipe(catchError(this.handleError));
  }

  getSatisfactionByLawyer(from?: string, to?: string): Observable<any> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get('/api/dashboard/satisfaction/by-lawyer', { params }).pipe(catchError(this.handleError));
  }

  // 5. Metricas por mes
  getMonthlyIncome(year: number): Observable<any> {
    return this.http.get(`/api/dashboard/income/income`, { params: new HttpParams().set('year', year.toString()) });
  }

  getMonthlyEvolution(year: number): Observable<any>{
    return this.http.get(`/api/dashboard/income/evolution-by-status`, { params: new HttpParams().set('year', year.toString()) });
  }

  getLawyerPerformanceOverTime(year: number): Observable<any>{
    return this.http.get(`/api/dashboard/income/evolution-by-lawyer`, { params: new HttpParams().set('year', year.toString()) });
  }

  private handleError(error: HttpErrorResponse) {
      let errorMessage = 'Algo falló. Por favor intente nuevamente.';
      if (error.status === 409) {
        errorMessage = 'El correo ya está registrado en el sistema.';
      }
      return throwError(() => errorMessage);
  }
}
