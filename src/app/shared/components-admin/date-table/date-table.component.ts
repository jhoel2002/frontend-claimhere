import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableColumn } from '../../../core/models/datatable-column.model';

@Component({
  selector: 'app-date-table',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, NgClass],
  templateUrl: './date-table.component.html',
  styleUrl: './date-table.component.css'
})
export class DateTableComponent {

  @Input() isRequest = false;
  @Input() columns: DataTableColumn[] = [];
  @Input() data: any[] = [];
  @Input() modalType?: 'company' | 'client' | 'employee' | 'customer';

  selectedOption = 'Last 30 days';

  options = [
    { id: 'filter-radio-1', label: 'Last day' },
    { id: 'filter-radio-2', label: 'Last 7 days' },
    { id: 'filter-radio-3', label: 'Last 30 days' },
    { id: 'filter-radio-4', label: 'Last month' },
    { id: 'filter-radio-5', label: 'Last year' }
  ];

  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(label: string) {
    this.selectedOption = label;
    this.dropdownOpen = false; // Optional: close dropdown on selection
  }
}
