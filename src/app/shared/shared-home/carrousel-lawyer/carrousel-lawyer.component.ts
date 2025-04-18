import { isPlatformBrowser, NgFor } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID  } from '@angular/core';

interface Lawyer {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  specialty?: string;
}

@Component({
  selector: 'app-carrousel-lawyer',
  standalone: true,
  imports: [NgFor],
  templateUrl: './carrousel-lawyer.component.html',
  styleUrls: ['./carrousel-lawyer.component.css']
})
export class CarrouselLawyerComponent {

  currentIndex = 0;
  itemsToShow = 3;
  isBrowser = false;

  lawyers: Lawyer[] = [
    {
      id: 1,
      name: 'John Doe',
      description: 'Especialista en derecho civil con más de 10 años de experiencia.',
      imageUrl: 'assets/img/abogado1.png',
      specialty: 'Derecho Civil'
    },
    {
      id: 2,
      name: 'Jane Smith',
      description: 'Experta en derecho corporativo y casos internacionales.',
      imageUrl: 'assets/img/abogado2.png',
      specialty: 'Derecho Corporativo'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      description: 'Especializado en derecho laboral y casos de discriminación.',
      imageUrl: 'assets/img/abogado3.png',
      specialty: 'Derecho Laboral'
    },
    {
      id: 4,
      name: 'Maria García',
      description: 'Especialista en derecho de familia y mediación.',
      imageUrl: 'assets/img/abogado4.png',
      specialty: 'Derecho Familiar'
    },
    {
      id: 5,
      name: 'David Wilson',
      description: 'Experto en derecho penal y defensa criminal.',
      imageUrl: 'assets/img/abogado5.png',
      specialty: 'Derecho Penal'
    },
    {
      id: 6,
      name: 'John Doe',
      description: 'Especialista en derecho civil con más de 10 años de experiencia.',
      imageUrl: 'assets/img/abogado6.png',
      specialty: 'Derecho Civil'
    },
    {
      id: 7,
      name: 'Jane Smith',
      description: 'Experta en derecho corporativo y casos internacionales.',
      imageUrl: 'assets/img/abogado7.png',
      specialty: 'Derecho Corporativo'
    },
    {
      id: 8,
      name: 'Robert Johnson',
      description: 'Especializado en derecho laboral y casos de discriminación.',
      imageUrl: 'assets/img/abogado8.png',
      specialty: 'Derecho Laboral'
    },
    {
      id: 9,
      name: 'Maria García',
      description: 'Especialista en derecho de familia y mediación.',
      imageUrl: 'assets/img/abogado9.png',
      specialty: 'Derecho Familiar'
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.updateItemsToShow(window.innerWidth);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (event.target instanceof Window) {
      this.updateItemsToShow(event.target.innerWidth);
    }
  }

  updateItemsToShow(width: number): void {
    const previousItemsToShow = this.itemsToShow;

    if (width < 640) {
      this.itemsToShow = 1;
    } else if (width < 1024) {
      this.itemsToShow = 2;
    } else {
      this.itemsToShow = 3;
    }

    // Solo ajustar el índice si cambió el número de items a mostrar
    if (previousItemsToShow !== this.itemsToShow) {
      this.adjustCurrentIndex();
    }
  }

  private adjustCurrentIndex(): void {
    const maxIndex = this.lawyers.length - this.itemsToShow;
    if (this.currentIndex > maxIndex) {
      this.currentIndex = Math.max(0, maxIndex);
    }
  }

  next(): void {
    const maxIndex = this.lawyers.length - this.itemsToShow;
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
    }
  }

  previous(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  isFirstSlide(): boolean {
    return this.currentIndex === 0;
  }

  isLastSlide(): boolean {
    return this.currentIndex >= this.lawyers.length - this.itemsToShow;
  }

  get visibleLawyers(): Lawyer[] {
    return this.lawyers.slice(this.currentIndex, this.currentIndex + this.itemsToShow);
  }

}
