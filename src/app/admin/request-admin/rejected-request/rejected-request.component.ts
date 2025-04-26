import { Component } from '@angular/core';
import { DateTableComponent } from "../../../shared/shared-admin/components-admin/date-table/date-table.component";
import { DataTableColumn } from '../../../core/core-admin/models-admin/datatable-column.model';

@Component({
  selector: 'app-rejected-request',
  standalone: true,
  imports: [DateTableComponent],
  templateUrl: './rejected-request.component.html',
  styleUrl: './rejected-request.component.css'
})
export class RejectedRequestComponent {

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
