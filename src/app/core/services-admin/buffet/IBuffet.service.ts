import { Observable } from "rxjs";

export interface IBuffetService {
  register(formData: any): unknown;
  update(arg0: string, formData: any): unknown;
  getAll(page: number, size: number): import("rxjs").Observable<import("../../models/pageable.model").Page<import("../../models/buffet.model").Buffet>>;
  getBuffetsBysearch(search: string, page: number, size: number): import("rxjs").Observable<import("../../models/pageable.model").Page<import("../../models/buffet.model").Buffet>>;
  getBuffetByDateRange(start: string, end: string, page: number, size: number): import("rxjs").Observable<import("../../models/pageable.model").Page<import("../../models/buffet.model").Buffet>>;
  getBuffetsBySearchAndDate(search: string, start: string, end: string, page: number, size: number): import("rxjs").Observable<import("../../models/pageable.model").Page<import("../../models/buffet.model").Buffet>>;
  getTypeCasesByCode(userBuffet: string): Observable<string[]>;

}
