import { CommonModule, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IRequestService } from '../../../core/services-admin/request/IRequest.service';
import { debounceTime, finalize, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { CUSTOMER_SERVICE_TOKEN } from '../../../core/models/token-injection.model';
import { log } from 'console';

@Component({
  selector: 'app-dropdown-customer',
  standalone: true,
  imports: [NgIf, CommonModule, ReactiveFormsModule],
  templateUrl: './dropdown-customer.component.html',
  styleUrls: ['./dropdown-customer.component.css']
})
export class DropdownCustomerComponent {
  @Input() valueService!: any;
  @Input() control!: FormControl;
  @Input() errorMsg: string | null = null;
  @Input() label: string = 'Buscar';
  @Input() searchMethod: string = 'searchValues';
  @Input() typeCase!: string;

  showDropdown = false;
  isLoading = false;

  values: {id:string, name:string}[] = [];

  elementRef = inject(ElementRef)

  filtered$: Observable<any[]> | null = null;

  ngOnInit(): void {
    this.filtered$ = this.control.valueChanges.pipe(
      startWith(''),
      switchMap(value => {
        const query = value?.trim() ?? '';

        this.showDropdown = query.length > 3;
        if (!this.showDropdown) return of([]);

        this.isLoading = true;
        return this.searchValues(query).pipe(
          finalize(() => (this.isLoading = false))
        );
      })
    );
  }

  private searchValues(query: string): Observable<any[]> {
    if (
      !query ||
      !this.valueService ||
      typeof this.valueService[this.searchMethod] !== 'function'
    ) {
      return of([]);
    }

    let result: any;

    if (this.label === 'Abogado') {
      result = this.valueService[this.searchMethod](query, this.typeCase);
    } else {
      result = this.valueService[this.searchMethod](query);
    }

    return result instanceof Observable ? result : of([]);
  }

  onValuesSelected(value: any): void {
    const codeCustomer: string = (value.busqueda || '').split(' - ')[0].trim();  
    this.control.setValue(codeCustomer);
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  onInputFocus() {
    this.showDropdown = true;
  }

}
