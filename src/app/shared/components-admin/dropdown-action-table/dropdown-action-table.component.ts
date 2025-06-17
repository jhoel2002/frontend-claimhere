import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ModalEntityType } from '../../../core/models/modal-entity-type';

@Component({
  selector: 'app-dropdown-action-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown-action-table.component.html',
  styleUrls: ['./dropdown-action-table.component.css']
})
export class DropdownActionTableComponent {

  @Input() entity!: ModalEntityType;
  @Input() row!: any;
  @Input() isEnabled!: boolean;

  @Output() viewRequest = new EventEmitter<any>();
  @Output() editItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();
  @Output() disableItem = new EventEmitter<any>();

  dropdownOpen: boolean = false;

  @ViewChild('dropdownContainerAction') dropdownContainerAction!: ElementRef;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event.target'])
  closeDropdown(targetElement: HTMLElement) {
    if (this.dropdownContainerAction && !this.dropdownContainerAction.nativeElement.contains(targetElement)) {
      this.dropdownOpen = false;
    }
  }

  onViewRequest() {
    this.viewRequest.emit();
    this.dropdownOpen = false;
  }

  onEditItem() {
    this.editItem.emit();
    this.dropdownOpen = false;
  }

  onDeleteItem() {
    this.deleteItem.emit();
    this.dropdownOpen = false;
  }

  onDisableItem() {
    this.disableItem.emit();
    this.dropdownOpen = false;
  }
}
