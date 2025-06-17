import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataTableColumn } from '../../../core/models/datatable-column.model';
import { Observable } from 'rxjs';
import { Page } from '../../../core/models/pageable.model';
import { DataTableComponent } from '../data-table/data-table.component';
import { DateRangeTableComponent } from '../date-range-table/date-range-table.component';
import { SearchTableComponent } from '../search-table/search-table.component';
import { PaginationTableComponent } from '../pagination-table/pagination-table.component';
import { ModalEntityType } from '../../../core/models/modal-entity-type';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-entity-filter',
  standalone: true,
  imports: [DataTableComponent, DateRangeTableComponent, SearchTableComponent, PaginationTableComponent, NgIf],
  templateUrl: './entity-filter.component.html',
  styleUrls: ['./entity-filter.component.css']
})
export class EntityFilterComponent<T> implements OnInit {

  @Input() title: string = '';
  @Input() columns: DataTableColumn[] = [];
  @Input() entity!: ModalEntityType;
  
  isDisabled: boolean = false;

  @Input() fetchFunction!: (
    search: string,
    start: string,
    end: string,
    page: number,
    size: number
  ) => Observable<Page<T>>;

  @Output() onRegister = new EventEmitter<void>();

  @Output() onDelete = new EventEmitter<any>();
  @Output() onDisable = new EventEmitter<any>();

  pageable: Page<T> = {
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 9,
    number: 0
  };

  dateRange = { start: '', end: '', filterApplied: false };
  searchText = { searchInput: '', isSearch: false };

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const hasDate = this.dateRange.filterApplied;
    const hasSearch = this.searchText.isSearch;

    const start = hasDate ? this.dateRange.start : '';
    const end = hasDate ? this.dateRange.end : '';
    const search = hasSearch ? this.searchText.searchInput : '';

    this.fetchFunction(search, start, end, this.pageable.number, this.pageable.size)
      .subscribe(data => {
        this.pageable = data;
      });
  }

  handleDateRange(dateRange: { start: string; end: string; filterApplied: boolean }) {
    this.dateRange = dateRange;
    this.pageable.number = 0;
    this.loadData();
  }

  handleSearch(searchText: { searchInput: string; isSearch: boolean }) {
    this.searchText = searchText;
    this.pageable.number = 0;
    this.loadData();
  }

  handleCancelSearchFilter() {
    this.searchText.isSearch = false;
    this.pageable.number = 0;
    this.loadData();
  }

  handleCancelDateFilter() {
    this.dateRange.filterApplied = false;
    this.pageable.number = 0;
    this.loadData();
  }

  onPageChange(page: number) {
    this.pageable.number = page;
    this.loadData();
  }

  onReload() {
    this.pageable.number = 0;
    this.loadData();
  }

  triggerRegister() {
    this.onRegister.emit();
  }

  triggerDelete(item: any) {
    this.onDelete.emit(item);
  }

  triggerDisable(item: any) {
    this.onDisable.emit(item);
  }

  triggerDisableUser(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

}
