import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination-table.component.html',
  styleUrls: ['./pagination-table.component.css']
})
export class PaginationTableComponent {

  @Input() totalPages: number = 0;
  @Input() currentPage: number = 0;
  @Input() maxVisiblePages: number = 5;

  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    const pages: number[] = [];
    let startPage = Math.max(0, this.currentPage - Math.floor(this.maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + this.maxVisiblePages);

    if (endPage - startPage < this.maxVisiblePages) {
      startPage = Math.max(0, endPage - this.maxVisiblePages);
    }

    for (let i = startPage; i < endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  changePage(page: number) {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

}
