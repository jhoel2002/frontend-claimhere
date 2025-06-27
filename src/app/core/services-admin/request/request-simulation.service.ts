import { Injectable } from '@angular/core';
import { CaseRequest } from '../../models/case-request.model';
import { delay, Observable, of, throwError } from 'rxjs';
import { Page } from '../../models/pageable.model';
import { IRequestService } from './IRequest.service';
import { Document } from '../../models/case-request.model';
import { document } from '../../models/document.model';
import { Task } from '../../models/task.model';

interface CaseRequestFull {
  id: number;
  code: string;
  title: string;
  description: string;
  type_case: string;
  status_request: string;
  creation: string;
  customerName: string;
  customerEmail: string;
  customerDocumentType: string;
  customerDocumentNumber: string;
  lawyerName: string;
  cotizacion?: Document;
  resolution?: Document;
  evidencias?: Document[];
  tasks?: Task[];
}

@Injectable({
  providedIn: 'root'
})
export class RequestSimulationService implements IRequestService {

  private statuses: Array<'RECEIVED'| 'APPROVED' | 'REJECTED' | 'VALIDATED' | 'QUOTED' | 'ASSIGNED' | 'QUOTED_APPROVED'> = ['RECEIVED', 'APPROVED', 'REJECTED', 'VALIDATED' , 'QUOTED' , 'ASSIGNED', 'QUOTED_APPROVED'];
  private typeCases = ['Divorcio', 'Custodia', 'Penal', 'Laboral', 'Civil'];
  private customers = [
    { name: 'Jane Doe', email: 'jane.doe@example.com', documentType: 'Cédula', documentNumber: '987654321' },
    { name: 'John Smith', email: 'john.smith@example.com', documentType: 'Passport', documentNumber: '123456789' },
    { name: 'Alice Johnson', email: 'alice.j@example.com', documentType: 'ID', documentNumber: '567890123' }
  ];

  private lawyerFirstNames = ['Carlos', 'Ana', 'Luis', 'María', 'Jorge', 'Laura'];
  private lawyerLastNames = ['Pérez', 'García', 'Rodríguez', 'Fernández', 'Torres', 'Ramírez'];
  
  private generateRandomTasks(count: number): Task[] {
    const tasks = ['Realizando informe', 'Preparando reunión', 'Redactando contrato', 'Analizando pruebas', 'Llamando al cliente', 'Revisando expediente'];
    const statuses = ['PENDIENTE', 'EN PROCESO', 'FINALIZADO'];
    const comentarios = [
      'Se están realizando las pruebas',
      'Se continúa trabajando',
      'Tarea finalizada con éxito',
      'Pendiente de aprobación',
      'Esperando respuesta del cliente',
      'En revisión por el abogado'
    ];

    const taskList: Task[] = [];

    for (let i = 0; i < count; i++) {
      const task = tasks[Math.floor(Math.random() * tasks.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const comentary = comentarios[Math.floor(Math.random() * comentarios.length)];
      
      // Generar una fecha aleatoria dentro de los últimos 30 días
      const randomDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

      taskList.push({
        task,
        status,
        comentary,
        date: randomDate.toISOString()
      });
    }

    return taskList;
  }

  private requestsFull: CaseRequestFull[] = Array.from({ length: 100 }).map((_, i) => {
    const date = new Date(Date.now() - Math.random() * 10_000_000_000);
    const day   = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year  = date.getFullYear();

    const status = this.statuses[Math.floor(Math.random() * this.statuses.length)];

    const firstName = this.lawyerFirstNames[Math.floor(Math.random() * this.lawyerFirstNames.length)];
    const lastName  = this.lawyerLastNames[Math.floor(Math.random() * this.lawyerLastNames.length)];
    const lawyerName  = `${firstName} ${lastName}`;

    // ← elige un cliente al azar
    const customer = this.customers[Math.floor(Math.random() * this.customers.length)];

    return {
      id: i + 1,
      code: `REQ${String(i + 1).padStart(4, '0')}`,
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
        name: 'cotizacion.pdf',
        code: 'cotizacion-simulada'
      },
      resolution: {
        name: 'resolution.pdf',
        code: 'resolution-simulada'
      },
      evidencias: [
        {
          name: 'evidencia.pdf',
          code: 'evidencia-simulada'
        }
      ],
      lawyerName: lawyerName,
      tasks: this.generateRandomTasks(4)
    };
  });

  private requests: CaseRequest[] = this.requestsFull.map(reqFull => ({
    id: reqFull.id,
    code: reqFull.code,
    title: reqFull.title,
    description: reqFull.description,
    type_case: reqFull.type_case,
    status_request: reqFull.status_request,
    customerName: reqFull.customerName,
    customerEmail: reqFull.customerEmail,
    customerDocumentType: reqFull.customerDocumentType,
    customerDocumentNumber: reqFull.customerDocumentNumber,
    creation: reqFull.creation,
    lawyerName: reqFull.lawyerName,
    cotization: reqFull.cotizacion,
    evidences: reqFull.evidencias,
    lenghtTask: reqFull.tasks?.length!,
    resolution: reqFull.resolution,
    tasks: reqFull.tasks
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

  getRequestsByStatus(page: number, size: number, status: 'APPROVED' | 'REJECTED' | 'PENDING', lawyerCode?: string): Observable<Page<CaseRequest>> {
    const statusFilter = status === 'PENDING'
      ? ['RECEIVED', 'VALIDATED', 'QUOTED', 'ASSIGNED', 'QUOTED_APPROVED']
      : [status];

    const filtered = this.requests.filter(req => statusFilter.includes(req.status_request));
    const start = page * size;
    const end = start + size;
    const content = filtered.slice(start, end);

    // Vista previa personalizada según el estado
    const previewList: Partial<CaseRequest>[] = content.map(request => {
      const base: Partial<CaseRequest> = {
        code: request.code,
        title: request.title,
        type_case: request.type_case,
        creation: request.creation,
        status_request: request.status_request,
        customerName: request.customerName,
      };

      // Si es aprobado, agrega :
      if (status === 'APPROVED') {
        base.lawyerName = request.lawyerName;
        base.resolution = request.resolution;
        base.lenghtTask = request.lenghtTask;
      }
      return base;
    });

    const result: Page<CaseRequest> = {
      content: previewList as CaseRequest[],
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      size,
      number: page
    };

    return of(result).pipe(delay(300));
  }

  getRequestsBySearch(searchText: string, page: number, size: number, status: 'APPROVED' | 'REJECTED' | 'PENDING', lawyerCode?: string): Observable<Page<CaseRequest>> {
    const statusFilter = status === 'PENDING'
    ? ['RECEIVED', 'VALIDATED', 'QUOTED', 'ASSIGNED', 'QUOTED_APPROVED']
    : [status];
    
    const filtered = this.requests.filter(req => 
      statusFilter.includes(req.status_request) &&
      (
        req.title.toLowerCase().includes(searchText.toLowerCase()) ||
        req.description!.toLowerCase().includes(searchText.toLowerCase()) ||
        req.customerName.toLowerCase().includes(searchText.toLowerCase())
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

  getRequestsByDateRange(start: string, end: string, page: number, size: number, status: 'APPROVED' | 'REJECTED' | 'PENDING', lawyerCode?: string): Observable<Page<CaseRequest>> {
    const startDate = new Date(this.parseDate(start));
    const endDate = new Date(this.parseDate(end));

    const statusFilter = status === 'PENDING'
    ? ['RECEIVED', 'VALIDATED', 'QUOTED', 'ASSIGNED', 'QUOTED_APPROVED']
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

  getRequestsBySearchAndDate(searchText: string, start: string, end: string, page: number, size: number, status: 'APPROVED' | 'REJECTED' | 'PENDING', lawyerCode?: string): Observable<Page<CaseRequest>> {
    const startDate = new Date(this.parseDate(start));
    const endDate = new Date(this.parseDate(end));

    const statusFilter = status === 'PENDING'
    ? ['RECEIVED', 'VALIDATED', 'QUOTED', 'ASSIGNED', 'QUOTED_APPROVED']
    : [status];

    const filtered = this.requests.filter(req => {
      const date = new Date(this.parseDate(req.creation));
      const matchesText = !searchText || (
        req.title.toLowerCase().includes(searchText.toLowerCase()) ||
        req.description!.toLowerCase().includes(searchText.toLowerCase()) ||
        req.customerName.toLowerCase().includes(searchText.toLowerCase())
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

  registerResolution(code: string, resolution: document): Observable<any> {
    const formData = new FormData();
    formData.append('file', resolution.document);
    formData.append('code', code);

    return of({ message: 'Resolución registrada con éxito', code })
      .pipe(delay(1500));
  }

  getRequestView(code: string): Observable<Partial<CaseRequest>>{
    const request = this.requests.find(request => request.code === code);
    if (!request) {
      console.warn(`No se encontró el request con code: ${code}`);
      return throwError(() => new Error(`Request con codigo ${code} no encontrado.`));
    }
    // Devuelve solo una parte
    const preview: Partial<CaseRequest> = {
      description: request.description,
      customerName: request.customerName,
      customerEmail: request.customerEmail,
      customerDocumentType: request.customerDocumentType,
      customerDocumentNumber: request.customerDocumentNumber,
      evidences: request.evidences,
      cotization: request.cotization,
      lawyerName: request.lawyerName,
    };

    return of(preview);
  }

  getRequestByCode(code: string): Observable<CaseRequest> {
    const request = this.requests.find(request => request.code === code);
    if (!request) {
      console.warn(`No se encontró el request con code: ${code}`);
      return throwError(() => new Error(`Request con codigo ${code} no encontrado.`));
    }
    return of(request);
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

  getTasksByRequestCode(code: string): Observable<any> {
    const request = this.requests.find(r => r.code === code);
    return of(request?.tasks ?? []);
  }

  addTaskToRequest(code: string, newTask: Task): Observable<any> {
    newTask.date = new Date().toISOString();
    const request = this.requestsFull.find(r => r.code === code);
    if (request) {
      request?.tasks?.unshift(newTask);
    }
    return of(request);
  }
}
