import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-case-type-card',
  standalone: true,
  imports: [NgFor],
  templateUrl: './case-type-card.component.html',
  styleUrls: ['./case-type-card.component.css']
})
export class CaseTypeCardComponent {

  caseTypes: any[] = [
    {
      id: 1,
      title: 'Civil Law Cases',
      description: 'Handling disputes between individuals or organizations including contracts, property, and personal injury.',
      detailedInfo: 'Our civil law practice covers a wide range of cases including contract disputes, property litigation, personal injury claims, family law matters, and civil rights violations. We provide comprehensive legal representation to protect your interests and rights.',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200'
    },
    {
      id: 2,
      title: 'Criminal Defense',
      description: 'Expert defense representation for individuals facing criminal charges.',
      detailedInfo: 'Our criminal defense team handles all types of cases from misdemeanors to serious felonies. We provide aggressive defense strategies, thorough case investigation, and protection of your constitutional rights throughout the legal process.',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200'
    },
    {
      id: 3,
      title: 'Corporate Law',
      description: 'Legal services for businesses including formation, compliance, and litigation.',
      detailedInfo: 'We provide comprehensive corporate legal services including business formation, contract negotiation, regulatory compliance, mergers and acquisitions, and corporate litigation. Our team ensures your business interests are protected while maintaining legal compliance.',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200'
    },
    {
      id: 4,
      title: 'Family Law',
      description: 'Assistance with divorce, custody, and other family-related legal matters.',
      detailedInfo: 'Our family law practice handles sensitive matters including divorce, child custody, spousal support, adoption, and domestic violence cases. We provide compassionate representation while protecting your familys interests.',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200'
    },
    {
      id: 5,
      title: 'Corporate Law',
      description: 'Legal services for businesses including formation, compliance, and litigation.',
      detailedInfo: 'We provide comprehensive corporate legal services including business formation, contract negotiation, regulatory compliance, mergers and acquisitions, and corporate litigation. Our team ensures your business interests are protected while maintaining legal compliance.',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200'
    },
    {
      id: 6,
      title: 'Family Law',
      description: 'Assistance with divorce, custody, and other family-related legal matters.',
      detailedInfo: 'Our family law practice handles sensitive matters including divorce, child custody, spousal support, adoption, and domestic violence cases. We provide compassionate representation while protecting your familys interests.',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200'
    }
  ];

  expandedId: number | null = null;

  constructor() {}

  ngOnInit(): void {

  }

  toggleExpand(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  isExpanded(id: number): boolean {
    return this.expandedId === id;
  }
}
