import { Injectable } from '@angular/core';
import { ILawyerService } from './ILawyer.service';
import { Lawyer } from '../../models/lawyer.model';
import { Page } from '../../models/pageable.model';
import { delay, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LawyerSimulationService implements ILawyerService {

  private lawyers: Lawyer[] = Array.from({ length: 100 }).map((_, i) => {
    // nombres y apellidos ficticios
    const firstNames = ['Ana', 'Carlos', 'María', 'Juan', 'Pedro', 'Luis', 'Sofía', 'Camila', 'José', 'Valeria'];
    const middleNames = ['Andrés', 'Belén', 'César', 'Diana', 'Eduardo', 'Fabiola', 'Gustavo', 'Helena', 'Iván', 'Julia'];
    const lastNames = ['García', 'Martínez', 'López', 'Sánchez', 'Pérez', 'González', 'Rodríguez', 'Fernández', 'Ruiz', 'Díaz'];

    const name = `${firstNames[i % firstNames.length]} ${middleNames[Math.floor(Math.random() * middleNames.length)]}`;
    const last_name = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${name} ${last_name}`;

    const randomDate = () => {
      const date = new Date(Date.now() - Math.floor(Math.random() * 10_000_000_000));
      return `${date.getDate().toString().padStart(2, '0')}-` +
             `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
             `${date.getFullYear()}`;
    };

    return {
      id: i + 1,
      code: `LAW${String(i + 1).padStart(4, '0')}`,
      name,
      last_name,
      fullName,
      email: `user${i + 1}${['@gmail.com', '@hotmail.com', '@yahoo.com', '@example.com'][Math.floor(Math.random() * 4)]}`,
      phone: `9${Math.floor(10000000 + Math.random() * 90000000)}`,
      address: `${['Av.', 'Jr.', 'Calle', 'Psje.'][Math.floor(Math.random() * 4)]} ` +
               `${['Primavera', 'Las Flores', 'El Sol', 'La Luna', 'Libertad', 'La Paz'][Math.floor(Math.random() * 6)]} ` +
               `${Math.floor(Math.random() * 500) + 1}`,
      creation: randomDate(),
      enabled: Math.random() > 0.3,
      case_type: ['Penal', 'Civil', 'Laboral', 'Familia'][Math.floor(Math.random() * 4)],
      buffet: ['Bufete A', 'Bufete B', 'Bufete C'][i % 3],
    } satisfies Lawyer;
  });

  getAll(page: number, size: number): Observable<Page<Lawyer>> {
    const start = page * size;
    const end   = start + size;
    const content = this.lawyers.slice(start, end);

    return of({
      content,
      totalElements: this.lawyers.length,
      totalPages: Math.ceil(this.lawyers.length / size),
      number: page,
      size,
      first: page === 0,
      last: end >= this.lawyers.length,
      empty: content.length === 0
    });
  }

  getLawyersBysearch(searchText: string, page: number, size: number): Observable<Page<Lawyer>> {
    const q = searchText.toLowerCase();
    const filtered = this.lawyers.filter(l =>
      l.name.toLowerCase().includes(q)      ||
      l.last_name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q)
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

  private parseDate(d: string): Date {
    const [day, month, year] = d.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  getLawyersByDateRange(start: string, end: string, page: number, size: number): Observable<Page<Lawyer>> {
    const startDate = this.parseDate(start);
    const endDate   = this.parseDate(end);

    const filtered = this.lawyers.filter(l => {
      const cDate = this.parseDate(l.creation);
      return cDate >= startDate && cDate <= endDate;
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

  getLawyersBySearchAndDate(searchText: string, start: string, end: string, page: number, size: number): Observable<Page<Lawyer>> {
    const q         = searchText.toLowerCase();
    const startDate = this.parseDate(start);
    const endDate   = this.parseDate(end);

    const filtered = this.lawyers.filter(l => {
      const cDate = this.parseDate(l.creation);
      const matchesText = !searchText || (
        l.name.toLowerCase().includes(q)      ||
        l.last_name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q)
      );
      return matchesText && cDate >= startDate && cDate <= endDate;
    });

    const startIdx = page * size;
    const endIdx   = startIdx + size;

    return of({
      content: filtered.slice(startIdx, endIdx),
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      number: page,
      size
    });
  }

  register(data: Omit<Lawyer, 'id' | 'code' | 'creation' | 'enabled' | 'fullName'>): Observable<any> {
    const newLawyer: Lawyer = {
      ...data,
      id: this.lawyers.length + 1,
      code: `LAW${String(this.lawyers.length + 1).padStart(4, '0')}`,
      creation: new Date().toLocaleDateString('es-PE'),
      enabled: true,
      fullName: `${data.name} ${data.last_name}`.trim()
    };

    this.lawyers.unshift(newLawyer);
    return of({ message: 'Abogado registrado correctamente' }).pipe(delay(500));
  }

  update(code: string, data: Lawyer): Observable<any> {
    const index = this.lawyers.findIndex(l => l.code === code);
    if (index === -1) {
      return throwError(() => new Error('Abogado no encontrado'));
    }

    const updated = { ...this.lawyers[index], ...data };

    // si cambió name o last_name, actualiza fullName
    if (data.name !== undefined || data.last_name !== undefined) {
      updated.fullName = `${updated.name} ${updated.last_name}`.trim();
    }

    this.lawyers[index] = updated;
    return of({ message: 'Abogado actualizado correctamente' }).pipe(delay(500));
  }

  searchLawyers(query: string, typeCase: string): Observable<Lawyer[]> {
    if (!query.trim()) { return of([]); }
    const q = query.toLowerCase();

    const result = this.lawyers.filter(l =>
      l.email.toLowerCase().includes(q) ||
      l.code?.toLowerCase().includes(q)
    );

    return of(result).pipe(delay(500));
  }

  disabled(code: string, enabled: boolean): Observable<any> {
    const lawyer = this.lawyers.find(l => l.code === code);
    if (lawyer) {
      lawyer.enabled = !enabled;
      return of({ message: 'Usuario deshabilitado correctamente' }).pipe(delay(500));
    } else {
      return throwError(() => new Error('Usuario no encontrado'));
    }
  }

  delete(code: string): Observable<any>{
    const index = this.lawyers.findIndex(l => l.code === code);
    if (index === -1) {
      return throwError(() => new Error('Abogado no encontrado'));
    }

    this.lawyers.splice(index, 1);
    return of({ message: 'Abogado eliminado correctamente' }).pipe(delay(500));
  }

}
