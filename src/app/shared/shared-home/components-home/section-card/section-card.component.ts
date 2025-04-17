import { CommonModule, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';

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
  selector: 'app-section-card',
  standalone: true,
  imports: [NgFor,CardComponent, CommonModule],
  templateUrl: './section-card.component.html',
  styleUrls: ['./section-card.component.css']
})
export class SectionCardComponent implements OnInit {

  claims: Claim[] = [];
  displayedClaims: Claim[] = [];
  selectedClaim!: Claim;
  isModalOpen = false;

  // Pagination
  currentPage = 1;
  pageSize = 9;
  totalPages = 0;
  startIndex = 0;
  endIndex = 0;

  ngOnInit() {
    // Aquí normalmente cargarías los datos desde un servicio
    // Por ahora usaremos datos de ejemplo
    this.claims = this.getMockClaims();
    this.totalPages = Math.ceil(this.claims.length / this.pageSize);
    this.updateDisplayedClaims();
  }

  updateDisplayedClaims() {
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.claims.length);
    this.displayedClaims = this.claims.slice(this.startIndex, this.endIndex);
  }

  openClaimDetail(claim: Claim) {
    this.selectedClaim = claim;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedClaims();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedClaims();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updateDisplayedClaims();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  private getMockClaims(): Claim[] {
    // Datos de ejemplo
    return Array(20).fill(null).map((_, index) => ({
      id: `claim-${index + 1}`,
      date: new Date(2024, 0, index + 1).toLocaleDateString(),
      category: ['Technical', 'Billing', 'Service', 'Product'][Math.floor(Math.random() * 4)],
      title: `Claim #${index + 1} - Important Issue`,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      link: '#',
      avatar: `https://i.pravatar.cc/150?img=${index + 1}`,
      author: `User ${index + 1}`,
      status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
      details: 'Detailed information about the claim goes here. This includes all relevant information, communication history, and current status updates.'
    }));
  }

  cards = [
    {
      date: 'Mar 10, 2019',
      category: 'Design',
      title: 'Accessibility tools for designers and developers',
      description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit...',
      author: 'Khatab wedaa',
      avatar: 'https://images.unsplash.com/photo-1502980426475-b83966705988?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&q=80',
      link: '#'
    },
    {
      date: 'Mar 10, 2019',
      category: 'Design',
      title: 'Accessibility tools for designers and developers',
      description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit...',
      author: 'Khatab wedaa',
      avatar: 'https://images.unsplash.com/photo-1502980426475-b83966705988?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&q=80',
      link: '#'
    },
    {
      date: 'Apr 5, 2024',
      category: 'Tech',
      title: 'AI Trends in 2024',
      description: 'Exploring how AI is shaping industries and daily life...',
      author: 'Jane Doe',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      link: '#'
    },
    {
      date: 'Apr 5, 2024',
      category: 'Tech',
      title: 'AI Trends in 2024',
      description: 'Exploring how AI is shaping industries and daily life...',
      author: 'Jane Doe',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      link: '#'
    },
    {
      date: 'Apr 5, 2024',
      category: 'Tech',
      title: 'AI Trends in 2024',
      description: 'Exploring how AI is shaping industries and daily life...',
      author: 'Jane Doe',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      link: '#'
    },
    {
      date: 'Apr 5, 2024',
      category: 'Tech',
      title: 'AI Trends in 2024',
      description: 'Exploring how AI is shaping industries and daily life...',
      author: 'Jane Doe',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      link: '#'
    },
  ];

}
