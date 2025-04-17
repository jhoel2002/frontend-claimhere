import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

interface Claim {
  id: string;
  date: string;
  category: string;
  title: string;
  description: string;
  link: string;
  avatar: string;
  author: string;
  status: string;
  details: string;
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Input() claim!: Claim;
  @Input() isOpen = false;

  close() {
    this.isOpen = false;
  }

}
