import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dropdown-date-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dropdown-date-table.component.html',
  styleUrls: ['./dropdown-date-table.component.css']
})
export class DropdownDateTableComponent {

    options = [
    { id: 'filter-radio-1', label: 'Last day' },
    { id: 'filter-radio-2', label: 'Last 7 days' },
    { id: 'filter-radio-3', label: 'Last 30 days' },
    { id: 'filter-radio-4', label: 'Last month' },
    { id: 'filter-radio-5', label: 'Last year' }
  ];

  selectedOption = 'Last 30 days';
  dropdownOpen: boolean = false;

  @Output() optionChanged = new EventEmitter<string>();

  @ViewChild('dropdownContainerDate') dropdownContainerDate!: ElementRef;

  toggleDropdownDate() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(optionLabel: string) {
    this.selectedOption = optionLabel;
    this.dropdownOpen = false;
    this.optionChanged.emit(optionLabel);
  }

  @HostListener('document:click', ['$event.target'])
  closeDropdownDate(targetElement: HTMLElement) {
    if (this.dropdownContainerDate && !this.dropdownContainerDate.nativeElement.contains(targetElement)) {
      this.dropdownOpen = false;
    }
  }

}
