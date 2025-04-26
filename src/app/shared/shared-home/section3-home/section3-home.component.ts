import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-section3-home',
  standalone: true,
  imports: [NgFor],
  templateUrl: './section3-home.component.html',
  styleUrls: ['./section3-home.component.css']
})
export class Section3HomeComponent{

  features = [
    {
      icon: 'scale', // You can use your preferred icon system
      title: 'ABOGADOS CON LEGAL',
      subtitle: 'PERSONALIZADA'
    },
    {
      icon: 'users',
      title: 'PROFESIONALES PARA',
      subtitle: 'CONTACTAR'
    },
    {
      icon: 'truck',
      title: 'RESPUESTAS',
      subtitle: 'INMEDIATAS'
    },
    {
      icon: 'document',
      title: 'REVISIÓN Y REDACCIÓN',
      subtitle: 'DE DOCUMENTOS'
    }
  ];
}

