import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IDashboardBuffet } from './IDashboard-buffet.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardBuffetSimulationService implements IDashboardBuffet{

  // 1. Monitorear flujo de casos por estado
  getCasesByStatus(): Observable<{ name: string; value: number }[]> {
    return of([
      { name: 'Total de casos recibidos', value: 12 },
      { name: 'Total de casos resueltos', value: 9 },
      { name: 'Total de casos no resueltos', value: 7 },
      { name: 'Total de casos rechazados', value: 15 },
    ]);
  }

  // 2. Carga laboral por abogado
  getCasesByLawyer(): Observable<any[]> {
    return of([
      { name: 'Dra. Morales', value: 9 },
      { name: 'Dr. Pérez', value: 12 },
      { name: 'Dr. Santos', value: 7 },
      { name: 'Dr. Salinas', value: 4 },
      { name: 'Dr. Caycho', value: 16 },
      { name: 'Dra. Martinez', value: 3 },
      { name: 'Dr. Vargas', value: 8 },
      { name: 'Dr. Jimenez', value: 12 },
      { name: 'Dra. Mendoza', value: 7 },
      { name: 'Dr. Chota', value: 11 }
    ]);
  }

  getCasesByTypeCase(): Observable<{ name: string; value: number }[]> {
    return of([
      { name: 'Criminal', value: 8 },
      { name: 'Civil', value: 4 },
      { name: 'Familiar', value: 6 },
      { name: 'Penal', value: 3 },
    ]);
  }

  getCasesForMonth(): Observable<any[]> {
    return of([
      { name: 'Casos activos', value: 3 }, 
      { name: 'Casos recibidos', value: 5 },
      { name: 'Casos cerrados', value: 1 },
      { name: 'Casos rechazados', value: 1 },
      { name: 'Monto pagado S/', value: 8500 }
    ]);
  }

  getCasesMetrics(): Observable<any[]> {
    return of([
      { name: 'Tiempo promedio de resolución' , value: 50.3 }, 
      { name: 'Satisfacción promedio de clientes' , value: 5 },
      { name: 'Tasa de cierre exitosa (%)' , value: 84.2 },
      { name: 'Cantidad total de casos históricos' , value: 84 }
    ]);
  }
    
  // 3. Supervisar tiempos de atención
  getAvgResolutionTimeByLawyer(): Observable<any[]> {
    return of([
      { name: 'Dra. Morales', value: 43.3 },
      { name: 'Dr. Pérez', value: 42.6 },
      { name: 'Dr. Santos', value: 50.1 },
      { name: 'Dr. Salinas', value: 43.2 },
      { name: 'Dr. Caycho', value: 51.6 }
    ]);
  }

  getAvgStageTime(): Observable<any[]> {
    return of([
      { name: 'RECEIVED', value: 1.2 },
      { name: 'VALIDATED', value: 0.3 },
      { name: 'QUOTED', value: 1.5 },
      { name: 'ASSIGNED', value: 1.0 },
      { name: 'ACCEPTED', value: 0.5 }
    ]);            
  }

  // 4. Desempeño de abogados y buffets
  getPerformanceByLawyer(): Observable<any[]> {
    return of([
      {
        name: 'Dra. Morales',
        series: [
          { name: 'Resueltos', value: 18 },
          { name: 'No Resueltos', value: 15 }
        ]
      },
      {
        name: 'Dr. Pérez',
        series: [
          { name: 'Resueltos', value: 20 },
          { name: 'No Resueltos', value: 17 }
        ]
      },
      {
        name: 'Dr. Santos',
        series: [
          { name: 'Resueltos', value: 20 },
          { name: 'No Resueltos', value: 17 }
        ]
      },
      {
        name: 'Dr. Salinas',
        series: [
          { name: 'Resueltos', value: 20 },
          { name: 'No Resueltos', value: 17 }
        ]
      },
      {
        name: 'Dr. Caycho',
        series: [
          { name: 'Resueltos', value: 20 },
          { name: 'No Resueltos', value: 17 }
        ]
      },
    ]);
  }

  getSatisfactionByLawyer(): Observable<any[]> {
    return of([
      { name: 'Dra. Morales', value: 4.3 },
      { name: 'Dr. Pérez', value: 4.6 },
      { name: 'Dr. Santos', value: 4.1 },
      { name: 'Dr. Salinas', value: 4.2 },
      { name: 'Dr. Caycho', value: 3.6 },
    ]);
  }

  getMonthlyIncome(): Observable<any[]> {
    return of([
      {"name": "Ingresos",
        "series": [
          { name: 'Dec',  value: 14500 },
          { name: 'Jan',  value: 12000 },
          { name: 'Feb',  value: 13500 },
          { name: 'Mar',  value: 14800 },
          { name: 'Apr',  value: 16000 },
          { name: 'May',  value: 15000 },
        ]
      }
    ]);
  }

  getMonthlyEvolution(): Observable<any[]> {
    return of([
      {"name": "Recibidos",
        "series": [
          { name: 'Dec',  value: 20 },
          { name: 'Jan',  value: 23 },
          { name: 'Feb',  value: 18 },
          { name: 'Mar',  value: 25 },
          { name: 'Apr',  value: 22 },
          { name: 'May',  value: 30 },
        ]
      },
      {"name": "Aceptados",
        "series": [
          { name: 'Dec',  value: 18 },
          { name: 'Jan',  value: 20 },
          { name: 'Feb',  value: 15 },
          { name: 'Mar',  value: 20 },
          { name: 'Apr',  value: 20 },
          { name: 'May',  value: 27 },
        ]
      },
      {"name": "Rechazados",
        "series": [
          { name: 'Dec',  value: 2 },
          { name: 'Jan',  value: 3 },
          { name: 'Feb',  value: 3 },
          { name: 'Mar',  value: 5 },
          { name: 'Apr',  value: 2 },
          { name: 'May',  value: 3 },
        ]
      }
    ]);
  }
  getLawyerPerformanceOverTime(): Observable<any[]> {
  return of([
    {
          name: 'Dra. Morales',
          series: [
            { name: 'Dec', value: 5 },
            { name: 'Jan', value: 6 },
            { name: 'Feb', value: 7 },
            { name: 'Mar', value: 1 },
            { name: 'Apr', value: 4 },
            { name: 'May', value: 3 }
          ]
        },
        {
          name: 'Dr. Pérez',
          series: [
            { name: 'Dec', value: 3 },
            { name: 'Jan', value: 4 },
            { name: 'Feb', value: 5 },
            { name: 'Mar', value: 3 },
            { name: 'Apr', value: 2 },
            { name: 'May', value: 4 }
          ]
        },
        {
          name: 'Dr. Santos',
          series: [
            { name: 'Dec', value: 3 },
            { name: 'Jan', value: 4 },
            { name: 'Feb', value: 5 },
            { name: 'Mar', value: 7 },
            { name: 'Apr', value: 2 },
            { name: 'May', value: 4 }
          ]
        },
        {
          name: 'Dr. Salinas',
          series: [
            { name: 'Dec', value: 4 },
            { name: 'Jan', value: 2 },
            { name: 'Feb', value: 1 },
            { name: 'Mar', value: 5 },
            { name: 'Apr', value: 3 },
            { name: 'May', value: 6 }
          ]
        },
        {
          name: 'Dr. Caycho',
          series: [
            { name: 'Dec', value: 2 },
            { name: 'Jan', value: 5 },
            { name: 'Feb', value: 1 },
            { name: 'Mar', value: 0 },
            { name: 'Apr', value: 2 },
            { name: 'May', value: 1 }
          ]
        }
      ]);
    }
}
