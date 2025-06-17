import { Injectable } from '@angular/core';
import { IUserService } from './IUserService';
import { delay, Observable, of, throwError } from 'rxjs';
import { Page } from '../../models/pageable.model';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserSimulationService implements IUserService {

  private users:User[] = Array.from({ length: 100 }).map((_, i) => ({
    id: i + 1,
    code: `USR${i + 1}`,
    name: ['Ana', 'Carlos', 'María', 'Juan', 'Pedro', 'Luis', 'Sofía', 'Camila', 'José', 'Valeria'][i % 10] + ` ${['Andrés', 'Belén', 'César', 'Diana', 'Eduardo', 'Fabiola', 'Gustavo', 'Helena', 'Iván', 'Julia'][Math.floor(Math.random() * 10)]}`,
    last_name: ['García', 'Martínez', 'López', 'Sánchez', 'Pérez', 'González', 'Rodríguez', 'Fernández', 'Ruiz', 'Díaz'][Math.floor(Math.random() * 10)],
    email: `user${i + 1}${['@gmail.com','@hotmail.com','@yahoo.com','@example.com'][Math.floor(Math.random() * 4)]}`,
    phone: `9${Math.floor(10000000 + Math.random() * 90000000)}`,
    role: ['Admin', 'User', 'Manager', 'Supervisor', 'Guest'][i % 5],
    address: `${['Av.', 'Jr.', 'Calle', 'Psje.'][Math.floor(Math.random() * 4)]} ${['Primavera', 'Las Flores', 'El Sol', 'La Luna', 'Libertad', 'La Paz'][Math.floor(Math.random() * 6)]} ${Math.floor(Math.random() * 500) + 1}`,
    enabled: Math.random() > 0.2, // 80% chance to be enabled
    creation: (() => {
      const date = new Date(+(new Date()) - Math.floor(Math.random() * 10000000000));
      const day = ('0' + date.getDate()).slice(-2);
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    })()
  }));

  getAll(pageNumber: number, pageSize: number): Observable<Page<User>> {
    const start = pageNumber * pageSize;
    const end = start + pageSize;

    const content = this.users.slice(start, end);
    const totalElements = this.users.length;
    const totalPages = Math.ceil(this.users.length / pageSize);

    return of({
      content,
      totalElements,
      totalPages,
      number: pageNumber,
      size: pageSize,
      first: pageNumber === 0,
      last: pageNumber === totalPages - 1,
      empty: content.length === 0
    });
  }

  search(searchText: string, page: number, size: number): Observable<Page<User>> {
    const filtered = this.users.filter(u =>
      u.name.toLowerCase().includes(searchText.toLowerCase()) ||
      u.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase())
    );
    const start = page * size;
    const end = start + size;
    const content = filtered.slice(start, end);
    return of({
      content,
      totalPages: Math.ceil(filtered.length / size),
      size: size,
      number: page,
      totalElements: filtered.length
    });
  }

  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  getUsersByDateRange(start: string, end: string, page: number, size: number): Observable<Page<User>> {
    const startISO = this.parseDate(start);
    const endISO = this.parseDate(end);

    const startDate = new Date(startISO);
    const endDate = new Date(endISO);

    const filtered = this.users.filter(user => {
      const userDateISO = this.parseDate(user.creation);
      const creationDate = new Date(userDateISO);
      return creationDate >= startDate && creationDate <= endDate;
    });

    const startIndex = page * size;
    const endIndex = startIndex + size;

    const content = filtered.slice(startIndex, endIndex);

    return of({
      content,
      totalPages: Math.ceil(filtered.length / size),
      size: size,
      number: page,
      totalElements: filtered.length
    });
  }

  getUsersBySearchAndDate(searchText: string, start: string, end: string, page: number, size: number): Observable<Page<User>> {
    const startISO = this.parseDate(start);
    const endISO = this.parseDate(end);

    const startDate = new Date(startISO);
    const endDate = new Date(endISO);

    const filtered = this.users.filter(user => {
      const userDateISO = this.parseDate(user.creation);
      const creationDate = new Date(userDateISO);

      const matchesText = !searchText || (
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
      );
      const matchesDate = creationDate >= startDate && creationDate <= endDate;
      return matchesText && matchesDate;
    });

    const startIndex = page * size;
    const endIndex = startIndex + size;
    const content = filtered.slice(startIndex, endIndex);

    return of({
      content,
      totalPages: Math.ceil(filtered.length / size),
      size: size,
      number: page,
      totalElements: filtered.length
    });
  }

  register(userData: User): Observable<any> {
    const newUser: User = {
          ...userData,
          id: this.users.length + 1,
          creation: new Date().toLocaleDateString('es-PE')
        };
     
        this.users.unshift(newUser);
        return of({ message: 'Usuario registrado correctamente' }).pipe(delay(500));
  }

  disabled(code: string, enabled: boolean): Observable<any> {
    const user = this.users.find(u => u.code === code);
    if (user) {
      user.enabled = !enabled;
      return of({ message: 'Usuario deshabilitado correctamente' }).pipe(delay(500));
    } else {
      return throwError(() => new Error('Usuario no encontrado'));
    }
  }
  
  update(userId: number, userData: User): Observable<any> {
    const index = this.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      this.users[index] = {
        ...this.users[index],
        ...userData
      };
      return of({ message: 'Usuario actualizado correctamente' }).pipe(delay(500));
    } else {
      return throwError(() => new Error('Usuario no encontrado'));
    }
  }

  delete(code: string): Observable<any>{
    const index = this.users.findIndex(u => u.code === code);
    if (index === -1) {
      return throwError(() => new Error('Usuario no encontrado'));
    }

    this.users.splice(index, 1);
    return of({ message: 'Usuario eliminado correctamente' }).pipe(delay(500));
  }
}
