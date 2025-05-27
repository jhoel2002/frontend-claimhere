import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, inject, NgZone, OnInit, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { DatepickerOptions} from 'flowbite';
import { DateRangePicker } from 'flowbite-datepicker';

@Component({
  selector: 'app-date-range-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './date-range-table.component.html',
  styleUrls: ['./date-range-table.component.css'],
})
export class DateRangeTableComponent {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {

  }

  startDate: string = '';
  endDate: string = '';

  filterApplied: boolean = false;

  ngZone=inject(NgZone);

  @Output() dateRangeSelected = new EventEmitter<{start: string, end: string, filterApplied: boolean}>();
  @Output() dateRangeCleared = new EventEmitter<void>();

  @ViewChild('dateRangePicker', { static: false }) dateRangePicker!: ElementRef<HTMLInputElement>;

  private datepickerInstance!: DateRangePicker;

  ngAfterViewInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      const options: DatepickerOptions = {
        defaultDatepickerId: null,
        autohide: true,
        format: 'dd/mm/yyyy',
        maxDate: null,
        minDate: null,
        buttons: true,
        autoSelectToday: 0,
        title: null,
        rangePicker: true,
      };

      this.datepickerInstance = new DateRangePicker( this.dateRangePicker.nativeElement, options);
    }
  }

  applyDateRange() {
    const selectedDates: string[] = this.datepickerInstance.getDates();
    if (selectedDates && selectedDates.length === 2) {
      const startDateObj = new Date(selectedDates[0]);
      const endDateObj = new Date(selectedDates[1]);
      this.startDate = this.formatDate(startDateObj);
      this.endDate = this.formatDate(endDateObj);
      this.filterApplied = true;
      this.dateRangeSelected.emit({ start: this.startDate, end: this.endDate, filterApplied: this.filterApplied });
    }
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  clearDateRange() {
    this.startDate = '';
    this.endDate = '';
    this.filterApplied = false;

    this.dateRangeCleared.emit();
  }
}
