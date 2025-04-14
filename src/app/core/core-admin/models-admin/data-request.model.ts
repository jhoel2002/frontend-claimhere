export interface DataRequest {
  idReclamo: string;
  codigo: string;
  nombreCliente: string;
  tipoDocIdentidad: string;
  docIdentidad: string;
  correoCliente: string;
  nombreEmpresa: string;
  titulo: string;
  reclamo: string;
  estadoActual: string;
  puntuacion: number;
  fecha: Date | string;
  evidencias: string[];
  estadoEmpresa: string;
}
