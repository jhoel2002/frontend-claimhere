import { Injectable } from '@angular/core';
import { CaseRequest } from '../../models/case-request.model';
import { delay, Observable, of, throwError } from 'rxjs';
import { Page } from '../../models/pageable.model';
import { IRequestService } from './IRequest.service';
import { CaseRequestFull } from '../../models/case-request-full.model';

@Injectable({
  providedIn: 'root'
})
export class RequestSimulationService implements IRequestService {

  private statuses: Array<'APPROVED' | 'REJECTED' | 'PENDING'> = ['APPROVED', 'REJECTED', 'PENDING'];
  private typeCases = ['Divorcio', 'Custodia', 'Penal', 'Laboral', 'Civil'];
  private customers = [
    { name: 'Jane Doe', email: 'jane.doe@example.com', documentType: 'Cédula', documentNumber: '987654321' },
    { name: 'John Smith', email: 'john.smith@example.com', documentType: 'Passport', documentNumber: '123456789' },
    { name: 'Alice Johnson', email: 'alice.j@example.com', documentType: 'ID', documentNumber: '567890123' }
  ];

  private requests: CaseRequest[] = Array.from({ length: 100 }).map((_, i) => ({
    id: i + 1,
    title: `Solicitud ${i + 1}`,
    description: `Descripción de la solicitud ${i + 1}`,
    type_case: this.typeCases[i % this.typeCases.length],
    status_request: this.statuses[Math.floor(Math.random() * this.statuses.length)],
    customer: this.customers[Math.floor(Math.random() * this.customers.length)].name,
    application_date: (() => {
      const date = new Date(Date.now() - Math.floor(Math.random() * 10000000000));
      const day = ('0' + date.getDate()).slice(-2);
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    })()
  }));

  private requestsFull: CaseRequestFull[] = Array.from({ length: 100 }).map((_, i) => ({
    id: (i + 1).toString(),
    caseId: `CASE-${i + 1}`,
    title: `Solicitud ${i + 1}`,
    description: `Descripción de la solicitud ${i + 1}`,
    type_case: this.typeCases[i % this.typeCases.length],
    status_request: this.statuses[Math.floor(Math.random() * this.statuses.length)],
    customer: this.customers[Math.floor(Math.random() * this.customers.length)],
    applicationDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    evidence: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg'
    ],
    downloadableEvidence: [
      {
        fileName: 'documento-simulado.pdf',
        fileUrl: 'https://example.com/documento.pdf'
      }
    ]
  }));

  private convertToISO(date: string): string {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  }

  getAll(page: number, size: number): Observable<Page<CaseRequest>> {
    const start = page * size;
    const end = start + size;
    const content = this.requests.slice(start, end);
    return of({
      content,
      totalElements: this.requests.length,
      totalPages: Math.ceil(this.requests.length / size),
      number: page,
      size,
    });
  }

  getRequestsByStatus(page: number, size: number, status: 'APPROVED' | 'REJECTED' | 'PENDING'): Observable<Page<CaseRequest>> {
    const filtered = this.requests.filter(req => req.status_request === status);
    const start = page * size;
    const end = start + size;
    const content = filtered.slice(start, end);
    return of({
      content,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      number: page,
      size
    });
  }

  getRequestsBySearch(searchText: string, page: number, size: number): Observable<Page<CaseRequest>> {
    const filtered = this.requests.filter(req => 
      req.title.toLowerCase().includes(searchText.toLowerCase()) ||
      req.description.toLowerCase().includes(searchText.toLowerCase()) ||
      req.customer.toLowerCase().includes(searchText.toLowerCase())
    );

    const start = page * size;
    const end = start + size;
    const content = filtered.slice(start, end);

    return of({
      content,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      number: page,
      size
    });
  }

  getRequestsByDateRange(start: string, end: string, page: number, size: number, status: 'APPROVED' | 'REJECTED' | 'PENDING'): Observable<Page<CaseRequest>> {
    const startDate = new Date(this.convertToISO(start));
    const endDate = new Date(this.convertToISO(end));

    const filtered = this.requests.filter(req => {
      const date = new Date(this.convertToISO(req.application_date));
      return req.status_request === status && date >= startDate && date <= endDate;
    });

    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = filtered.slice(startIndex, endIndex);

    return of({
      content,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      number: page,
      size
    });
  }

  getRequestsBySearchAndDate(searchText: string, start: string, end: string, page: number, size: number, status: 'APPROVED' | 'REJECTED' | 'PENDING'): Observable<Page<CaseRequest>> {
    const startDate = new Date(this.convertToISO(start));
    const endDate = new Date(this.convertToISO(end));

    const filtered = this.requests.filter(req => {
      const date = new Date(this.convertToISO(req.application_date));
      const matchesText = !searchText || (
        req.title.toLowerCase().includes(searchText.toLowerCase()) ||
        req.description.toLowerCase().includes(searchText.toLowerCase()) ||
        req.customer.toLowerCase().includes(searchText.toLowerCase())
      );
      return matchesText && req.status_request === status && date >= startDate && date <= endDate;
    });

    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = filtered.slice(startIndex, endIndex);

    return of({
      content,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      number: page,
      size
    });
  }

  register(data: CaseRequest): Observable<any> {
    const newRequest: CaseRequest = {
      ...data,
      id: this.requests.length + 1,
      application_date: new Date().toLocaleDateString('es-PE')
    };
    this.requests.unshift(newRequest);
    return of({ message: 'Solicitud registrada correctamente' }).pipe(delay(500));
  }

  update(id: number, data: CaseRequest): Observable<any> {
    const index = this.requests.findIndex(req => req.id === id);
    if (index !== -1) {
      this.requests[index] = {
        ...this.requests[index],
        ...data
      };
      return of({ message: 'Solicitud actualizada correctamente' }).pipe(delay(500));
    } else {
      return throwError(() => new Error('Solicitud no encontrada'));
    }
  }

  getRequestById(id: string): Observable<CaseRequestFull> {
    const mockData = this.requestsFull.find(request => request.id === id) || this.requestsFull[0];
    return of(mockData);
  }
}
