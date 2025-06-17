import { Injectable } from '@angular/core';
import { CaseRequest } from '../../models/case-request.model';
import { delay, Observable, of, throwError } from 'rxjs';
import { Page } from '../../models/pageable.model';
import { IRequestService } from './IRequest.service';
import { CaseRequestFull } from '../../models/case-request-full.model';
import { document } from '../../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class RequestSimulationService implements IRequestService {

  private statuses: Array<'RECEIVED'| 'APPROVED' | 'REJECTED' | 'VALIDATED' | 'QUOTED' | 'ASSIGNED'> = ['RECEIVED', 'APPROVED', 'REJECTED', 'VALIDATED' , 'QUOTED' , 'ASSIGNED'];
  private typeCases = ['Divorcio', 'Custodia', 'Penal', 'Laboral', 'Civil'];
  private customers = [
    { name: 'Jane Doe', email: 'jane.doe@example.com', documentType: 'Cédula', documentNumber: '987654321' },
    { name: 'John Smith', email: 'john.smith@example.com', documentType: 'Passport', documentNumber: '123456789' },
    { name: 'Alice Johnson', email: 'alice.j@example.com', documentType: 'ID', documentNumber: '567890123' }
  ];

  private lawyerFirstNames = ['Carlos', 'Ana', 'Luis', 'María', 'Jorge', 'Laura'];
  private lawyerLastNames = ['Pérez', 'García', 'Rodríguez', 'Fernández', 'Torres', 'Ramírez'];

  private requestsFull: CaseRequestFull[] = Array.from({ length: 100 }).map((_, i) => {
  const date = new Date(Date.now() - Math.random() * 10_000_000_000);
  const day   = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year  = date.getFullYear();

  const status = this.statuses[Math.floor(Math.random() * this.statuses.length)];
  const shouldAssignLawyer = status === 'ASSIGNED';

  const firstName = this.lawyerFirstNames[Math.floor(Math.random() * this.lawyerFirstNames.length)];
  const lastName  = this.lawyerLastNames[Math.floor(Math.random() * this.lawyerLastNames.length)];
  const fullName  = `${firstName} ${lastName}`;

  // ← elige un cliente al azar
  const customer = this.customers[Math.floor(Math.random() * this.customers.length)];

  return {
    id: i + 1,
    code: `LAW${String(i + 1).padStart(4, '0')}`,
    title: `Solicitud ${i + 1}`,
    description: `Descripción de la solicitud ${i + 1}`,
    type_case: this.typeCases[i % this.typeCases.length],
    status_request: status,
    customerName: customer.name,
    customerEmail: customer.email,
    customerDocumentType: customer.documentType,
    customerDocumentNumber: customer.documentNumber,
    creation: `${day}-${month}-${year}`,
    cotizacion: {
      name: 'cotizacion.pdf',     // string, no número
      code: 'cotizacion-simulada'
    },
    evidencias: [
      {
        name: 'evidencia.pdf',    // string, no número
        code: 'evidencia-simulada'
      }
    ],
    lawyerName: shouldAssignLawyer ? fullName : ''
  };
});

  private requests: CaseRequest[] = this.requestsFull.map(reqFull => ({
    id: reqFull.id,
    code: reqFull.code,
    title: reqFull.title,
    description: reqFull.description,
    type_case: reqFull.type_case,
    status_request: reqFull.status_request,
    customer: reqFull.customerName,
    creation: reqFull.creation,
    lawyerName: reqFull.lawyerName
  }));

  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
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
    const statusFilter = status === 'PENDING'
    ? ['RECEIVED', 'VALIDATED', 'QUOTED', 'ASSIGNED']
    : [status];
    
    const filtered = this.requests.filter(req => statusFilter.includes(req.status_request));
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

  getRequestsBySearch(searchText: string, page: number, size: number, status: 'APPROVED' | 'REJECTED' | 'PENDING'): Observable<Page<CaseRequest>> {
    const statusFilter = status === 'PENDING'
    ? ['RECEIVED', 'VALIDATED', 'QUOTED', 'ASSIGNED']
    : [status];
    
    const filtered = this.requests.filter(req => 
      statusFilter.includes(req.status_request) &&
      (
        req.title.toLowerCase().includes(searchText.toLowerCase()) ||
        req.description.toLowerCase().includes(searchText.toLowerCase()) ||
        req.customer.toLowerCase().includes(searchText.toLowerCase())
      )
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
    const startDate = new Date(this.parseDate(start));
    const endDate = new Date(this.parseDate(end));

    const statusFilter = status === 'PENDING'
    ? ['RECEIVED', 'VALIDATED', 'QUOTED', 'ASSIGNED']
    : [status];


    const filtered = this.requests.filter(req => {
      const date = new Date(this.parseDate(req.creation));
      return statusFilter.includes(req.status_request) && date >= startDate && date <= endDate;
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
    const startDate = new Date(this.parseDate(start));
    const endDate = new Date(this.parseDate(end));

    const statusFilter = status === 'PENDING'
    ? ['RECEIVED', 'VALIDATED', 'QUOTED', 'ASSIGNED']
    : [status];

    const filtered = this.requests.filter(req => {
      const date = new Date(this.parseDate(req.creation));
      const matchesText = !searchText || (
        req.title.toLowerCase().includes(searchText.toLowerCase()) ||
        req.description.toLowerCase().includes(searchText.toLowerCase()) ||
        req.customer.toLowerCase().includes(searchText.toLowerCase())
      );
      return matchesText && statusFilter.includes(req.status_request) && date >= startDate && date <= endDate;
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

  register(codeCustomer: string, codeLawyer: string, requestData: CaseRequest, evidencias: File[], cotizacion: File): Observable<any> {
    const newRequest: CaseRequest = {
      ...requestData,
      id: this.requests.length + 1,
      creation: new Date().toLocaleDateString('es-PE')
    };
    this.requests.unshift(newRequest);
    return of({ message: 'Solicitud registrada correctamente' }).pipe(delay(500));
  }

  getRequestByCode(code: string): Observable<CaseRequestFull> {
    const mockData = this.requestsFull.find(request => request.code === code);
    if (!mockData) {
      console.warn(`No se encontró el request con code: ${code}`);
      return throwError(() => new Error(`Request con id ${code} no encontrado.`));
    }
    return of(mockData);
  }

  updateStatus(code: string, status: string): Observable<any> {
    const index = this.requests.findIndex(req => req.code === code);
    const fullIndex = this.requestsFull.findIndex(reqFull => reqFull.code === code);

    if (index !== -1 && fullIndex !== -1) {
      // Actualizar en this.requests
      this.requests[index].status_request = status;

      // Actualizar en this.requestsFull
      this.requestsFull[fullIndex].status_request = status;

      return of({ message: 'Solicitud actualizada correctamente' }).pipe(delay(500));
    } else {
      return throwError(() => new Error('Solicitud no encontrada'));
    }
  }

  updateStatusWithLawyer(code: string, lawyer: any): Observable<any> {
    const index = this.requests.findIndex(req => req.code === code);
    const fullIndex = this.requestsFull.findIndex(reqFull => reqFull.code === code);

    if (index !== -1 && fullIndex !== -1) {

      // Guardar abogado asignado (puedes ajustar el campo según tu modelo)
      (this.requestsFull[fullIndex] as any).lawyer = lawyer;
      (this.requests[index] as any).lawyer = lawyer;

      return of({ message: 'Solicitud actualizada con abogado asignado' }).pipe(delay(500));
    } else {
      return throwError(() => new Error('Solicitud no encontrada'));
    }
  }

  updateStatusWithCotization(code: string, cotization: any): Observable<any> {
    const index = this.requests.findIndex(req => req.code === code);
    const fullIndex = this.requestsFull.findIndex(reqFull => reqFull.code === code);

    if (index !== -1 && fullIndex !== -1) {
      this.requestsFull[fullIndex].cotizacion = cotization;
      return of({ message: 'Solicitud actualizada con cotización' }).pipe(delay(500));
    } else {
      return throwError(() => new Error('Solicitud no encontrada'));
    }
  }
  
}
