import { Component } from '@angular/core';
import { DataTableColumn } from '../../../core/models/datatable-column.model';
import { DataTableComponent } from '../../../shared/components-admin/data-table/data-table.component';

@Component({
  selector: 'app-accepted-request',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './accepted-request.component.html',
  styleUrl: './accepted-request.component.css'
})
export class AcceptedRequestComponent {

  columns: DataTableColumn[] = [
    { label: 'Código', dataKey: 'codigo' },
    { label: 'Título del Reclamo', dataKey: 'titulo' },
    { label: 'Cliente', dataKey: 'nombreCliente' },
    { label: 'Correo', dataKey: 'correo' },
    { label: 'Empresa', dataKey: 'nombreEmpresa' },
    { label: 'Puntuacion', dataKey: 'puntuacion' },
  ];
  data: any[] = [];
}
