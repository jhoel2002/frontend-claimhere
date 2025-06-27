import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IBuffetService } from './IBuffet.service';

@Injectable({
  providedIn: 'root'
})
export class BuffetSimulationService implements IBuffetService{

  private typesOfTask: string[] = [
    'Redacción de demanda',
    'Revisión de contrato',
    'Análisis de pruebas',
    'Audiencia preliminar',
    'Seguimiento judicial',
    'Consulta con el cliente',
    'Elaboración de informe legal',
    'Gestión de documentación',
    'Negociación extrajudicial',
    'Estudio de jurisprudencia',
    'Preparación de alegatos',
    'Redacción de apelación',
    'Revisión de expediente',
    'Coordinación con procurador',
    'Visita a juzgado',
    'Entrega de notificaciones',
    'Audiencia de conciliación',
    'Elaboración de carta notarial',
    'Actualización de estado del caso',
    'Asesoría legal especializada'
  ];

  register(formData: any): unknown {
    throw new Error('Method not implemented.');
  }
  update(arg0: string, formData: any): unknown {
    throw new Error('Method not implemented.');
  }
  getAll(page: number, size: number): import("rxjs").Observable<import("../../models/pageable.model").Page<import("../../models/buffet.model").Buffet>> {
    throw new Error('Method not implemented.');
  }
  getBuffetsBysearch(search: string, page: number, size: number): import("rxjs").Observable<import("../../models/pageable.model").Page<import("../../models/buffet.model").Buffet>> {
    throw new Error('Method not implemented.');
  }
  getBuffetByDateRange(start: string, end: string, page: number, size: number): import("rxjs").Observable<import("../../models/pageable.model").Page<import("../../models/buffet.model").Buffet>> {
    throw new Error('Method not implemented.');
  }
  getBuffetsBySearchAndDate(search: string, start: string, end: string, page: number, size: number): import("rxjs").Observable<import("../../models/pageable.model").Page<import("../../models/buffet.model").Buffet>> {
    throw new Error('Method not implemented.');
  }
  getTypeCasesByCode(userBuffet: string): Observable<string[]> {
    throw new Error('Method not implemented.');
  }

  getTypeOfTaskByBuffet(code: string): Observable<any>{
      return of(this.typesOfTask);
  }

}
