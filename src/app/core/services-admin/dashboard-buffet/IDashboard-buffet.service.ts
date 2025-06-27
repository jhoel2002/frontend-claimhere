import { Observable } from "rxjs";

export interface IDashboardBuffet {
    // 1. Monitorear flujo de casos por estado
    getCasesByStatus(from?: string, to?: string): Observable<{ name: string; value: number }[]>;

    // 2. Carga laboral por abogado y buffet
    getCasesByLawyer(from?: string, to?: string): Observable<{ name: string; value: number }[]>;
    getCasesByTypeCase(from?: string, to?: string): Observable<{ name: string; value: number }[]>

    //2.1 Metricas
    getCasesForMonth(from?: string, to?: string): Observable<{ name: string; value: number }[]>;
    getCasesMetrics(from?: string, to?: string): Observable<{ name: string; value: number }[]>;

    // 3. Supervisar tiempos de atención y resolución
    getAvgResolutionTimeByLawyer(from?: string, to?: string, buffetId?: number): Observable<any[]>;
    getAvgStageTime(stage: string, from?: string, to?: string): Observable<any[]>;

    // 4. Desempeño de abogados y buffets
    getPerformanceByLawyer(from?: string, to?: string, buffetId?: number): Observable<any[]>;
    getSatisfactionByLawyer(from?: string, to?: string): Observable<any[]>;
    
    // 5. Ingresos y facturación
    getMonthlyIncome(year: number): Observable<any[]>;
    getMonthlyEvolution(year: number): Observable<any[]>;
    getLawyerPerformanceOverTime(year: number): Observable<any[]>;
}
