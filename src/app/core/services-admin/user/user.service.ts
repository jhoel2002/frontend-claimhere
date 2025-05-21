import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, Observable, of, throwError } from 'rxjs';
import { DataUser } from '../../models/data-user.model';
import { environment } from '../../../../environments/environment';
import { nameEndpints } from '../../name-enpoints/name-endpoints';
import { User } from '../../models/user.model';
import { Page } from '../../models/pageable.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  private users = Array.from({ length: 100 }).map((_, i) => ({
    id: i + 1,
    name: ['Ana', 'Carlos', 'María', 'Juan', 'Pedro', 'Luis', 'Sofía', 'Camila', 'José', 'Valeria'][i % 10] + ` ${['Andrés', 'Belén', 'César', 'Diana', 'Eduardo', 'Fabiola', 'Gustavo', 'Helena', 'Iván', 'Julia'][Math.floor(Math.random() * 10)]}`,
    lastname: ['García', 'Martínez', 'López', 'Sánchez', 'Pérez', 'González', 'Rodríguez', 'Fernández', 'Ruiz', 'Díaz'][Math.floor(Math.random() * 10)],
    email: `user${i + 1}${['@gmail.com','@hotmail.com','@yahoo.com','@example.com'][Math.floor(Math.random() * 4)]}`,
    phone: `9${Math.floor(10000000 + Math.random() * 90000000)}`,
    role: ['Admin', 'User', 'Manager', 'Supervisor', 'Guest'][i % 5],
    address: `${['Av.', 'Jr.', 'Calle', 'Psje.'][Math.floor(Math.random() * 4)]} ${['Primavera', 'Las Flores', 'El Sol', 'La Luna', 'Libertad', 'La Paz'][Math.floor(Math.random() * 6)]} ${Math.floor(Math.random() * 500) + 1}`,
    creation: (() => {
      const date = new Date(+(new Date()) - Math.floor(Math.random() * 10000000000));
      const day = ('0' + date.getDate()).slice(-2);
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    })()
  }));

  getAll(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page.valueOf()).set('size', size.valueOf());
    const url: string = `${environment.baseUrl}${nameEndpints.usuarioEndpoint}`;
      return this.http.get<any>(url, {params: params})
        .pipe(catchError(this.handleError));
  }

  getAllUSimulation(pageNumber: number, pageSize: number): Observable<Page<User>> {
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

  search(searchText: string, page: number, size: number): Observable<any> {
    const params = new HttpParams().set('search', searchText).set('page', page.valueOf()).set('size', size.valueOf());
    const url: string = `${environment.baseUrl}${nameEndpints.usuarioEndpoint}/search`;
      return this.http.get<any>(url, { params })
        .pipe(catchError(this.handleError));
  }

  searchSimulation(searchText: string, page: number, size: number): Observable<any> {
    const filtered = this.users.filter(u =>
      u.name.toLowerCase().includes(searchText.toLowerCase()) ||
      u.lastname.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase())
    );
    const start = page * size;
    const end = start + size;
    const content = filtered.slice(start, end);
    return of({
      content,
      totalPages: Math.ceil(filtered.length / size),
      number: page,
      totalElements: filtered.length
    });
  }

  getUsersByDateRange(start: string, end: string, page: number, size: number): Observable<any> {
    const params = new HttpParams().set('start', start).set('end', end).set('page', page.valueOf()).set('size', size.valueOf());
    const url: string = `${environment.baseUrl}${nameEndpints.usuarioEndpoint}/date-range`;
      return this.http.get<any>(url, { params })
        .pipe(catchError(this.handleError));
  }

  convertToISO(dateInput: string | Date): string {
    if (dateInput instanceof Date) {
      return dateInput.toISOString();
    }

    if (typeof dateInput === 'string') {
      // suponiendo formato dd/mm/yyyy
      const parts = dateInput.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
      }
      // si no es el formato esperado, devolver tal cual o lanzar error
      return dateInput;
    }
    throw new Error('Invalid date input');
  }


  getUsersByDateRangeSimulation(start: string, end: string, page: number, size: number): Observable<any> {
    const startISO = this.convertToISO(start);
    const endISO = this.convertToISO(end);

    const startDate = new Date(startISO);
    const endDate = new Date(endISO);

    const filtered = this.users.filter(user => {
      const userDateISO = this.convertToISO(user.creation);
      const creationDate = new Date(userDateISO);
      return creationDate >= startDate && creationDate <= endDate;
    });

    const startIndex = page * size;
    const endIndex = startIndex + size;

    const content = filtered.slice(startIndex, endIndex);

    return of({
      content,
      totalPages: Math.ceil(filtered.length / size),
      number: page,
      totalElements: filtered.length
    });
  }

  getUsersBySearchAndDate(searchText: string, start: string, end: string, page: number, size: number): Observable<any> {
    const params = new HttpParams().set('searchText', searchText).set('start', start).set('end', end).set('page', page.valueOf()).set('size', size.valueOf());
    const url: string = `${environment.baseUrl}${nameEndpints.usuarioEndpoint}/date-search`;
      return this.http.get<any>(url, { params })
        .pipe(catchError(this.handleError));
  }

  getUsersBySearchAndDateSimulation(searchText: string, start: string, end: string, page: number, size: number): Observable<any> {
    const startISO = this.convertToISO(start);
    const endISO = this.convertToISO(end);

    const startDate = new Date(startISO);
    const endDate = new Date(endISO);

    const filtered = this.users.filter(user => {
      const userDateISO = this.convertToISO(user.creation);
      const creationDate = new Date(userDateISO);

      const matchesText = !searchText || (
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchText.toLowerCase()) ||
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
      number: page,
      totalElements: filtered.length
    });
  }

  register(userData: User): Observable<any> {
      return this.http.post<any>(`${environment.baseUrl}${nameEndpints.usuarioEndpoint}/register`, userData)
      .pipe(catchError(this.handleError));
  }

  registerSimulation(userData: User): Observable<any> {
    const newUser: User = {
      ...userData,
      id: this.users.length + 1,
      creation: new Date().toLocaleDateString('es-PE')
    };
 
    this.users.unshift(newUser);
    return of({ message: 'Usuario registrado correctamente' }).pipe(delay(500));
  }

  update(userId: number, userData: User): Observable<any>{
    return this.http
      .put<any>(
        `${environment.baseUrl}api/${nameEndpints.usuarioEndpoint}/update?idUser=${userId}`,userData)
      .pipe(catchError(this.handleError));
  }

  updateSimulation(userId: number, userData: User): Observable<any> {
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

  updatePerfil(usuarioData: DataUser): Observable<any>{
    return this.http
      .put<any>(
        `${environment.baseUrl}api/${nameEndpints.usuarioEndpoint}/updatePerfil`,usuarioData)
      .pipe(catchError(this.handleError));
  }

  delete(companyId: number, rol: string): Observable<any> {
    return this.http
      .delete(
        `${environment.baseUrl}api/${nameEndpints.usuarioEndpoint}/deleteUsuario?idUsuario=${companyId}&rol=${rol}`
      )
      .pipe(catchError(this.handleError));
  }

  findByCorreoUsuario(): Observable<DataUser> {
    return this.http
      .get<DataUser>(
        `${environment.baseUrl}api/${nameEndpints.usuarioEndpoint}/findUsuarioByCorreo`
      )
      .pipe(catchError(this.handleError));
  }
    
  private handleError(error:HttpErrorResponse){
    let errorMessage = 'Algo falló. Por favor intente nuevamente.';
    if (error.status === 403) {
      errorMessage ='Contraseña actual incorrecta';
    }
    if (error.status === 409) {
      errorMessage ='El correo ya está registrado en el sistema.';
    }
    if (error.status === 422) {
      errorMessage ='El correo o documento ya está registrado. Si ya es cliente y desea asignarlo como empleado o administrador, actualice su rol en la seccion Clientes';
    }
    return throwError(() => errorMessage);
  }
}
