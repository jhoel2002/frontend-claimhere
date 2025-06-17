import { Injectable } from '@angular/core';
import { Customer } from '../../models/customer.model';
import { delay, Observable, of, throwError } from 'rxjs';
import { Page } from '../../models/pageable.model';
import { ICustomerService } from './ICustomerService';

@Injectable({
  providedIn: 'root'
})
export class CustomerSimulationService implements ICustomerService {

  // ────────────────────────────────────────────────────────────────────────────────
  // Datos simulados
  // ────────────────────────────────────────────────────────────────────────────────
  private customers: Customer[] = Array.from({ length: 100 }).map((_, i) => {
    const firstNames = ['Lucía', 'Mateo', 'Valentina', 'Diego', 'Renata', 'Santiago', 'Emma', 'Gael', 'Isabella', 'Thiago'];
    const lastNames  = ['Torres', 'Rojas', 'Mendoza', 'Castillo', 'Vargas', 'Ramírez', 'Ortega', 'Morales', 'Navarro', 'Peña'];

    const firstName  = firstNames[i % firstNames.length];
    const lastName   = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName   = `${firstName} ${lastName}`;

    const docTypes   = ['DNI', 'Pasaporte', 'Carnet de Extranjería'];
    const documentType   = docTypes[i % docTypes.length];
    const documentNumber = `${Math.floor(10000000 + Math.random() * 90000000)}`;

    return {
      id: i + 1,
      code: `CLI${String(i + 1).padStart(4, '0')}`,
      name: firstName,
      last_name: lastName,
      fullName: fullName,
      document_type: documentType,
      document_number: documentNumber,
      email: `cliente${i + 1}${['@gmail.com', '@outlook.com', '@yahoo.es', '@mail.com'][Math.floor(Math.random() * 4)]}`,
      phone: `9${Math.floor(10000000 + Math.random() * 90000000)}`,
      address: `${['Av.', 'Jr.', 'Calle'][Math.floor(Math.random() * 3)]} ${['San Martín', 'Arequipa', 'Bolívar', 'Bolognesi'][Math.floor(Math.random() * 4)]} ${Math.floor(Math.random() * 500) + 1}`,
      enabled: Math.random() > 0.1,                 // 90 % activos
      creation: (() => {
        const date  = new Date(+(new Date()) - Math.floor(Math.random() * 10_000_000_000));
        const day   = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year  = date.getFullYear();
        return `${day}-${month}-${year}`;
      })(),
      buffet: ['Bufete A', 'Bufete B', 'Bufete C'][i % 3]
      // password se deja opcional
    } satisfies Customer;
  });

  // ────────────────────────────────────────────────────────────────────────────────
  // CRUD y filtros
  // ────────────────────────────────────────────────────────────────────────────────
  getAll(page: number, size: number): Observable<Page<Customer>> {
    const start   = page * size;
    const end     = start + size;
    const content = this.customers.slice(start, end);

    return of({
      content,
      totalElements: this.customers.length,
      totalPages: Math.ceil(this.customers.length / size),
      number: page,
      size,
      first: page === 0,
      last: end >= this.customers.length,
      empty: content.length === 0
    });
  }

  getCustomerBysearch(searchText: string, page: number, size: number): Observable<Page<Customer>> {
    const q = searchText.toLowerCase();
    const filtered = this.customers.filter(c =>
      c.fullName!.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)    ||
      c.document_number.includes(q)
    );

    const start = page * size;
    const end   = start + size;
    const content = filtered.slice(start, end);

    return of({
      content,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      number: page,
      size
    });
  }

  getCustomersByDateRange(start: string, end: string, page: number, size: number): Observable<Page<Customer>> {
    const startDate = this.parseDate(start);
    const endDate   = this.parseDate(end);

    const filtered = this.customers.filter(c => {
      const creationDate = this.parseDate(c.creation!);
      return creationDate >= startDate && creationDate <= endDate;
    });

    const startIdx = page * size;
    const endIdx   = startIdx + size;
    const content  = filtered.slice(startIdx, endIdx);

    return of({
      content,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      number: page,
      size
    });
  }

  getCustomersBySearchAndDate(searchText: string, start: string, end: string, page: number, size: number): Observable<Page<Customer>> {
    const startDate = this.parseDate(start);
    const endDate   = this.parseDate(end);
    const q         = searchText.toLowerCase();

    const filtered = this.customers.filter(c => {
      const creationDate = this.parseDate(c.creation!);
      const matchesText  = !searchText || (
        c.fullName!.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)    ||
        c.document_number.includes(q)
      );
      return matchesText && creationDate >= startDate && creationDate <= endDate;
    });

    const startIdx = page * size;
    const endIdx   = startIdx + size;
    const content  = filtered.slice(startIdx, endIdx);

    return of({
      content,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      number: page,
      size
    });
  }

  // ────────────────────────────────────────────────────────────────────────────────
  // Helpers
  // ────────────────────────────────────────────────────────────────────────────────
  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // ────────────────────────────────────────────────────────────────────────────────
  // Alta, edición y búsqueda puntual
  // ────────────────────────────────────────────────────────────────────────────────
  
  
  register(data: Partial<Customer>): Observable<any> {
    // Si confías en que el formulario SIEMPRE enviará estos campos:
    const newCustomer: Customer = {
      id: this.customers.length + 1,
      code: `CLI${String(this.customers.length + 1).padStart(4, '0')}`,
      creation: new Date().toLocaleDateString('es-PE'),
      enabled: true,
      name:        data.name!,
      last_name:        data.last_name!,          // “¡confío en que no es undefined!”
      document_type:   data.document_type!,
      document_number: data.document_number!,
      email:           data.email!,
      phone:           data.phone!,
      address:         data.address!,
      password:        data.password,         // opcional
      buffet:          data.buffet            // opcional
    };

    this.customers.unshift(newCustomer);
    return of({ message: 'Cliente registrado correctamente' }).pipe(delay(500));
  }

  update(code: string, data: Customer): Observable<any> {
    const index = this.customers.findIndex(c => c.code === code);
    if (index !== -1) {
      this.customers[index] = { ...this.customers[index], ...data };
      return of({ message: 'Cliente actualizado correctamente' }).pipe(delay(500));
    }
    return throwError(() => new Error('Cliente no encontrado'));
  }

  /** Autocompletado por número de documento */
  searchCustomers(query: string): Observable<Customer[]> {
    if (!query.trim()) { return of([]); }

    const filtered = this.customers.filter(c =>
      c.document_number.includes(query)
    );
    return of(filtered).pipe(delay(500));     // Simula latencia HTTP
  }
}