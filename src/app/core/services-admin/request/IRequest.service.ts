import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../../models/pageable.model';
import { CaseRequest } from '../../models/case-request.model';
import { CaseRequestFull } from '../../models/case-request-full.model';

export interface IRequestService {
  getAll(page: number, size: number): Observable<Page<CaseRequest>>;
  getRequestsByStatus(page: number, size: number, status: string): Observable<Page<CaseRequest>>;
  getRequestsBySearch(searchText: string, page: number, size: number, status: string): Observable<Page<CaseRequest>>
  getRequestsByDateRange(start: string, end: string, page: number, size: number, status: string): Observable<Page<CaseRequest>>;
  getRequestsBySearchAndDate(searchText: string, start: string, end: string, page: number, size: number, status: string): Observable<Page<CaseRequest>>;
  register(data: CaseRequest): Observable<any>;
  update(id: number, data: CaseRequest): Observable<any>;
  getRequestById(id: string): Observable<CaseRequestFull>;
}
