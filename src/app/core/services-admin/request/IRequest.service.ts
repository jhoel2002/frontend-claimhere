import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../../models/pageable.model';
import { CaseRequest } from '../../models/case-request.model';
// import { CaseRequestFull } from '../../models/case-request-full.model';
import { document } from '../../models/document.model';
import { Task } from '../../models/task.model';

export interface IRequestService {
  getAll(page: number, size: number): Observable<Page<CaseRequest>>;
  getRequestsByStatus(page: number, size: number, status: string, lawyerCode?: string): Observable<Page<CaseRequest>>;
  getRequestsBySearch(searchText: string, page: number, size: number, status: string, lawyerCode?: string): Observable<Page<CaseRequest>>
  getRequestsByDateRange(start: string, end: string, page: number, size: number, status: string, lawyerCode?: string): Observable<Page<CaseRequest>>;
  getRequestsBySearchAndDate(searchText: string, start: string, end: string, page: number, size: number, status: string, lawyerCode?: string): Observable<Page<CaseRequest>>;
  register(codeCustomer: string, codeLawyer: string, requestData: CaseRequest, evidencias: File[], cotizacion: File): Observable<any>;
  getRequestByCode(code: string): Observable<CaseRequest>;
  getRequestView(code: string): Observable<Partial<CaseRequest>>;
  updateStatus(code: string, status: string): Observable<any>;
  updateStatusWithLawyer(code: string, selectedLawyer: any): Observable<any>;
  updateStatusWithCotization(code: string, cotization: document): Observable<any>;
  getTasksByRequestCode(code: string): Observable<any>;
  addTaskToRequest(code: string, newTask: Task): Observable<any>;
  registerResolution(code: string, resolution: document): Observable<any>;
}
