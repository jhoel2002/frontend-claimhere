import { Component } from '@angular/core';
import { DateTableComponent } from "../../../shared/shared-admin/components-admin/date-table/date-table.component";
import { DataTableColumn } from '../../../core/core-admin/models-admin/datatable-column.model';

@Component({
  selector: 'app-accepted-request',
  standalone: true,
  imports: [DateTableComponent],
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
