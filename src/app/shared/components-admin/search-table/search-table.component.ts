import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, Subject } from 'rxjs';

@Component({
  selector: 'app-search-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.css']
})
export class SearchTableComponent{

  searchInputText: string = '';
  isSearch: boolean = false;

  @Output() onSearch = new EventEmitter<{searchInput: string, isSearch: boolean}>();
  @Output() noSearch = new EventEmitter<void>();

  searchWithButton() {
    this.isSearch = true;
    const searchInput = this.searchInputText.trim();
    this.onSearch.emit({searchInput, isSearch: this.isSearch});
  }
  noSearchWithButton(){
    this.isSearch = false;
    this.searchInputText = '';
    this.noSearch.emit();
  }
}
