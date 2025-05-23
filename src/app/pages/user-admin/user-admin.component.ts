import { Component, inject } from '@angular/core';
import { DataTableComponent } from '../../shared/components-admin/data-table/data-table.component';
import { DataTableColumn } from '../../core/models/datatable-column.model';
import { UserService } from '../../core/services-admin/user/user.service';
import { PaginationTableComponent } from '../../shared/components-admin/pagination-table/pagination-table.component';
import { SearchTableComponent } from '../../shared/components-admin/search-table/search-table.component';
import { DateRangeTableComponent } from '../../shared/components-admin/date-range-table/date-range-table.component';
import { User } from '../../core/models/user.model';
import { Observable } from 'rxjs';
import { Page } from '../../core/models/pageable.model';
import { ModalService } from '../../core/services-admin/modal/modal.service';
import { ModalUserFormComponent } from './modal-user-form/modal-user-form.component';
import { EntityFilterComponent } from '../../shared/components-admin/entity-filter/entity-filter.component';

@Component({
  selector: 'app-user-admin',
  standalone: true,
  // imports: [DataTableComponent, ModalUserFormComponent, DateRangeTableComponent, SearchTableComponent, PaginationTableComponent],
  imports: [EntityFilterComponent, ModalUserFormComponent],
  templateUrl: './user-admin.component.html',
  styleUrl: './user-admin.component.css'
})
export class UserAdminComponent {

  // pageable: Page<User> = {
  //   content: [],
  //   totalPages: 0,
  //   totalElements: 0,
  //   size: 9,
  //   number: 0
  // };

  // dateRange: {start: string, end: string, filterApplied: boolean} = {start: '', end: '', filterApplied: false};

  // searchText: {searchInput: string, isSearch: boolean} = {searchInput: '', isSearch: false};

  // userService = inject(UserService);
  // modalService = inject(ModalService);

  // columns: DataTableColumn[] = [
  //   { label: 'Nombre', dataKey: 'name' },
  //   { label: 'Apellido', dataKey: 'lastname' },
  //   { label: 'Correo', dataKey: 'email'},
  //   { label: 'Telefono', dataKey: 'phone' },
  //   { label: 'Rol', dataKey: 'role' },
  //   { label: 'Direccion', dataKey: 'address' },
  //   { label: 'Fecha de Creacion', dataKey: 'creation' },
  // ];

  // ngOnInit(): void {
  //   this.loadUsers();
  // }

  // openModalRegister() {
  //   this.modalService.openModalForCreation(); 
  // }

  // loadUsers() {
  //   let request$: Observable<Page<User>>;

  //   const hasDate = this.dateRange.filterApplied;
  //   const hasSearch = this.searchText.isSearch;

  //   if (hasDate && hasSearch) {
  //     request$ = this.userService.getUsersBySearchAndDateSimulation(
  //       this.searchText.searchInput, this.dateRange.start, this.dateRange.end, this.pageable.number, this.pageable.size);
  //   } else if (hasDate) {
  //     request$ = this.userService.getUsersByDateRangeSimulation(
  //       this.dateRange.start, this.dateRange.end, this.pageable.number, this.pageable.size);
  //   } else if (hasSearch) {
  //     request$ = this.userService.searchSimulation(
  //       this.searchText.searchInput, this.pageable.number, this.pageable.size);
  //   } else {
  //     request$ = this.userService.getAllUSimulation(this.pageable.number, this.pageable.size);
  //   }

  //   request$.subscribe(data => {
  //     this.pageable = data;
  //   });
  // }

  // handleDateRange(dateRange: {start: string, end: string, filterApplied: boolean}) {
  //   this.dateRange = dateRange;
  //   this.pageable.number = 0;
  //   this.loadUsers();
  // }
  
  // handleSearch(searchText: {searchInput: string, isSearch: boolean}) {
  //   this.searchText = searchText;
  //   this.pageable.number = 0;
  //   this.loadUsers();
  // }

  // handleCancelSearchFilter() {
  //   this.pageable.number = 0;
  //   this.searchText.isSearch = false;
  //   this.loadUsers();
  // }

  // handleCancelDateFilter() {
  //   this.pageable.number = 0;
  //   this.dateRange.filterApplied = false;
  //   this.loadUsers();
  // }

  // onPageChange(page: number) {
  //   this.pageable.number = page;
  //   this.loadUsers();
  // }

  // reloadData() {
  //   this.pageable.number = 0;
  //   this.loadUsers();
  // }
  private userService = inject(UserService);
  private modalService = inject(ModalService);

  columns: DataTableColumn[] = [
    { label: 'Nombre', dataKey: 'name' },
    { label: 'Apellido', dataKey: 'lastname' },
    { label: 'Correo', dataKey: 'email' },
    { label: 'Teléfono', dataKey: 'phone' },
    { label: 'Rol', dataKey: 'role' },
    { label: 'Dirección', dataKey: 'address' },
    { label: 'Fecha de Creación', dataKey: 'creation' }
  ];

  loadUsers = (
    search: string,
    start: string,
    end: string,
    page: number,
    size: number
  ): Observable<Page<User>> => {
    const hasDate = start !== '' && end !== '';
    const hasSearch = search.trim() !== '';

    if (hasDate && hasSearch) {
      return this.userService.getUsersBySearchAndDateSimulation(search, start, end, page, size);
    } else if (hasDate) {
      return this.userService.getUsersByDateRangeSimulation(start, end, page, size);
    } else if (hasSearch) {
      return this.userService.searchSimulation(search, page, size);
    } else {
      return this.userService.getAllUSimulation(page, size);
    }
  };

  openModalRegister() {
    this.modalService.openModalForCreation();
  }
}
