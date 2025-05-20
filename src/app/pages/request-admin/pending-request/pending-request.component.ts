import { Component } from '@angular/core';
import { DataTableComponent } from "../../../shared/components-admin/data-table/data-table.component";
import { DataTableColumn } from '../../../core/models/datatable-column.model';

@Component({
  selector: 'app-pending-request',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './pending-request.component.html',
  styleUrl: './pending-request.component.css'
})
export class PendingRequestComponent {

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
