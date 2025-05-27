import { Injectable } from '@angular/core';
import { Customer } from '../../models/customer.model';
import { delay, Observable, of, throwError } from 'rxjs';
import { Page } from '../../models/pageable.model';
import { ICustomerService } from './ICustomerService';

@Injectable({
  providedIn: 'root'
})
export class CustomerSimulationService implements ICustomerService {
  
    private customers: Customer[] = Array.from({ length: 100 }).map((_, i) => ({
    id: i + 1,
    name: ['Lucía', 'Mateo', 'Valentina', 'Diego', 'Renata', 'Santiago', 'Emma', 'Gael', 'Isabella', 'Thiago'][i % 10],
    last_name: ['Torres', 'Rojas', 'Mendoza', 'Castillo', 'Vargas', 'Ramírez', 'Ortega', 'Morales', 'Navarro', 'Peña'][Math.floor(Math.random() * 10)],
    type_document: ['DNI', 'Pasaporte', 'Carnet de Extranjería'][i % 3],
    document: `${Math.floor(10000000 + Math.random() * 90000000)}`,
    email: `cliente${i + 1}${['@gmail.com', '@outlook.com', '@yahoo.es', '@mail.com'][Math.floor(Math.random() * 4)]}`,
    phone: `9${Math.floor(10000000 + Math.random() * 90000000)}`,
    address: `${['Av.', 'Jr.', 'Calle'][Math.floor(Math.random() * 3)]} ${['San Martín', 'Arequipa', 'Bolívar', 'Bolognesi'][Math.floor(Math.random() * 4)]} ${Math.floor(Math.random() * 500) + 1}`,
    creation: (() => {
      const date = new Date(+(new Date()) - Math.floor(Math.random() * 10000000000));
      const day = ('0' + date.getDate()).slice(-2);
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    })()
  }));

  getAll(page: number, size: number): Observable<Page<Customer>> {
    const start = page * size;
    const end = start + size;
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
    const filtered = this.customers.filter(c =>
      c.name.toLowerCase().includes(searchText.toLowerCase()) ||
      c.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
      c.email.toLowerCase().includes(searchText.toLowerCase())
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

  private convertToISO(date: string): string {
    const [day, month, year] = date.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  getCustomersByDateRange(start: string, end: string, page: number, size: number): Observable<Page<Customer>> {
    const startDate = new Date(this.convertToISO(start));
    const endDate = new Date(this.convertToISO(end));

    const filtered = this.customers.filter(customer => {
      const creationDate = new Date(this.convertToISO(customer.creation));
      return creationDate >= startDate && creationDate <= endDate;
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

  getCustomersBySearchAndDate(searchText: string, start: string, end: string, page: number, size: number): Observable<Page<Customer>> {
    const startDate = new Date(this.convertToISO(start));
    const endDate = new Date(this.convertToISO(end));

    const filtered = this.customers.filter(customer => {
      const creationDate = new Date(this.convertToISO(customer.creation));
      const matchesText = !searchText || (
        customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchText.toLowerCase())
      );
      return matchesText && creationDate >= startDate && creationDate <= endDate;
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

  register(data: Customer): Observable<any> {
    const newCustomer: Customer = {
      ...data,
      id: this.customers.length + 1,
      creation: new Date().toLocaleDateString('es-PE')
    };
    this.customers.unshift(newCustomer);
    return of({ message: 'Cliente registrado correctamente' }).pipe(delay(500));
  }

  update(id: number, data: Customer): Observable<any> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index !== -1) {
      this.customers[index] = {
        ...this.customers[index],
        ...data
      };
      return of({ message: 'Cliente actualizado correctamente' }).pipe(delay(500));
    } else {
      return throwError(() => new Error('Cliente no encontrado'));
    }
  }

}
