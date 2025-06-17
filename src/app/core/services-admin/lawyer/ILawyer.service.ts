import { Observable } from "rxjs";
import { Page } from "../../models/pageable.model";
import { Lawyer } from "../../models/lawyer.model";

export interface ILawyerService {

  getAll(page: number, size: number): Observable<Page<Lawyer>>;
  getLawyersBysearch(searchText: string, page: number, size: number): Observable<Page<Lawyer>>;
  getLawyersByDateRange(start: string, end: string, page: number, size: number): Observable<Page<Lawyer>>;
  getLawyersBySearchAndDate(searchText: string, start: string, end: string, page: number, size: number): Observable<Page<Lawyer>>;
  register(userData: Lawyer): Observable<any>;
  update(code: string, userData: Lawyer): Observable<any>;
  searchLawyers(query: string, typeCase:string): Observable<any>;
  disabled(code: string, enabled: boolean): Observable<any>;
  delete(code: string): Observable<any>
}
