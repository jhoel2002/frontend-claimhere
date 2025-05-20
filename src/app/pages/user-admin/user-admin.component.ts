import { Component, inject } from '@angular/core';
import { DataTableComponent } from '../../shared/components-admin/data-table/data-table.component';
import { DataTableColumn } from '../../core/models/datatable-column.model';
import { UserService } from '../../core/services-admin/user/user.service';
import { ModalUserFormComponent } from './modal-user-form/modal-user-form.component';
import { PaginationTableComponent } from '../../shared/components-admin/pagination-table/pagination-table.component';
import { SearchTableComponent } from '../../shared/components-admin/search-table/search-table.component';
import { DateRangeTableComponent } from '../../shared/components-admin/date-range-table/date-range-table.component';
import { User } from '../../core/models/user.model';
import { Observable } from 'rxjs';
import { Page } from '../../core/models/pageable.model';

@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [DataTableComponent, ModalUserFormComponent, DateRangeTableComponent, SearchTableComponent, PaginationTableComponent],
  templateUrl: './user-admin.component.html',
  styleUrl: './user-admin.component.css'
})
export class UserAdminComponent {

  pageSize: number = 9;
  pageNumber: number = 0;
  totalPages: number = 0;

  dateRange: {start: string, end: string, filterApplied: boolean} = {start: '', end: '', filterApplied: false};

  searchText: {searchInput: string, isSearch: boolean} = {searchInput: '', isSearch: false};

  userService = inject(UserService);

  columns: DataTableColumn[] = [
    { label: 'Nombre', dataKey: 'name' },
    { label: 'Apellido', dataKey: 'last_name' },
    { label: 'Correo', dataKey: 'email'},
    { label: 'Telefono', dataKey: 'phone' },
    { label: 'Rol', dataKey: 'role' },
    { label: 'Direccion', dataKey: 'address' },
    { label: 'Fecha de Creacion', dataKey: 'creation' },
  ];

  users: User[] = []

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    let request$: Observable<Page<User>>;

    const hasDate = this.dateRange.filterApplied;
    const hasSearch = this.searchText.isSearch;

    if (hasDate && hasSearch) {
      request$ = this.userService.getUsersBySearchAndDateSimulation(
        this.searchText.searchInput, this.dateRange.start, this.dateRange.end, this.pageNumber, this.pageSize);
    } else if (hasDate) {
      request$ = this.userService.getUsersByDateRangeSimulation(
        this.dateRange.start, this.dateRange.end, this.pageNumber, this.pageSize);
    } else if (hasSearch) {
      request$ = this.userService.searchSimulation(
        this.searchText.searchInput, this.pageNumber, this.pageSize);
    } else {
      request$ = this.userService.getAllUSimulation(this.pageNumber, this.pageSize);
    }

    request$.subscribe(data => {
      this.users = data.content;
      this.totalPages = data.totalPages;
      this.pageNumber = data.number;
    });
  }

  handleDateRange(dateRange: {start: string, end: string, filterApplied: boolean}) {
    this.dateRange = dateRange;
    this.pageNumber = 0;
    this.loadUsers();
  }
  
  handleSearch(searchText: {searchInput: string, isSearch: boolean}) {
    this.searchText = searchText;
    this.pageNumber = 0;
    this.loadUsers();
  }

  handleCancelSearchFilter() {
    this.pageNumber = 0;
    this.searchText.isSearch = false;
    this.loadUsers();
  }

  handleCancelDateFilter() {
    this.pageNumber = 0;
    this.dateRange.filterApplied = false;
    this.loadUsers();
  }

  onPageChange(page: number) {
    this.pageNumber = page;
    this.loadUsers();
  }

  reloadData() {
    this.pageNumber = 0;
    this.loadUsers();
  }
}
