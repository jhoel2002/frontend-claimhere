import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { DASHBOARD_SERVICE_TOKEN } from '../../core/models/token-injection.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard-buffet-admin',
  standalone: true,
  imports: [NgxChartsModule, CommonModule],
  templateUrl: './dashboard-buffet-admin.component.html',
  styleUrls: ['./dashboard-buffet-admin.component.css']
})
export class DashboardBuffetAdminComponent implements OnInit {

  dashboardService = inject(DASHBOARD_SERVICE_TOKEN);

  ratingGradient: Color = {
    name: 'ratingGradient',
    selectable: false,
    group: ScaleType.Linear,      // escala continua
    domain: ['#e11d48', '#fbbf24', '#22c55e'] // rojo → ámbar → verde
  };


  colorScheme: Color = {
    name: 'scheme',
    domain: [
    '#5AA454',  // verde
    '#E44D25',  // rojo
    '#CFC0BB',  // beige
    '#7AA3E5',  // azul claro
    '#A8385D',  // granate
    '#FFBF00',  // dorado
    '#6A1B9A',  // morado
    '#00ACC1',  // celeste
    '#F44336',  // rojo intenso
    '#43A047',  // verde hoja
    '#FB8C00',  // naranja
    '#1E88E5',  // azul fuerte
    '#8E24AA',  // violeta
    '#3949AB',  // azul oscuro
    '#00E676',  // verde neón
    '#D81B60',  // fucsia
    '#90A4AE',  // gris azulado
    '#00897B',  // verde petróleo
    '#D4E157',  // lima
    '#6D4C41'   // marrón
  ],
    selectable: true,
    group: ScaleType.Ordinal,
  };

  casesByStatus: any[] = [];
  casesByLawyer: any[] = [];
  casesByTypeCase: any[] =[];
  casesForMonth: any[] = [];
  casesMetrics: any[] = [];
  avgResolutionTimeByLawyer: any[] = [];
  avgStageTime: any[] = [];
  performanceByLawyer: any[] = [];
  satisfactionByLawyer: any[] = [];
  monthlyIncome: any[] = [];
  monthlyEvolution: any[] = [];
  monthlyLawyer: any[] = [];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    forkJoin({
      casesByStatus: this.dashboardService.getCasesByStatus(),
      casesByLawyer: this.dashboardService.getCasesByLawyer(),
      casesByTypeCase: this.dashboardService.getCasesByTypeCase(),
      casesForMonth: this.dashboardService.getCasesForMonth(),
      casesMetrics: this.dashboardService.getCasesMetrics(),
      avgResolutionTimeByLawyer: this.dashboardService.getAvgResolutionTimeByLawyer(),
      avgStageTime: this.dashboardService.getAvgStageTime('VALIDATED'),
      performanceByLawyer: this.dashboardService.getPerformanceByLawyer(),
      satisfactionByLawyer: this.dashboardService.getSatisfactionByLawyer(),
      monthlyIncome: this.dashboardService.getMonthlyIncome(new Date().getFullYear()),
      monthlyEvolution: this.dashboardService.getMonthlyEvolution(new Date().getFullYear()),
      monthlyLawyer: this.dashboardService.getLawyerPerformanceOverTime(new Date().getFullYear()),
    }).subscribe(result => {
      this.casesByStatus = result.casesByStatus;
      this.casesByLawyer = result.casesByLawyer;
      this.casesByTypeCase = result.casesByTypeCase;
      this.casesForMonth = result.casesForMonth;
      this.casesMetrics = result.casesMetrics;
      this.avgResolutionTimeByLawyer = result.avgResolutionTimeByLawyer;
      this.avgStageTime = result.avgStageTime;
      this.performanceByLawyer = result.performanceByLawyer;
      this.satisfactionByLawyer = result.satisfactionByLawyer;
      this.monthlyIncome = result.monthlyIncome;
      this.monthlyEvolution = result.monthlyEvolution;
      this.monthlyLawyer = result.monthlyLawyer;
    });

  }

}
