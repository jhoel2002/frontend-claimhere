import { Observable } from "rxjs";
import { Page } from "../../models/pageable.model";
import { Customer } from "../../models/customer.model";

export interface ICustomerService {
    getAll(page: number, size: number): Observable<Page<Customer>>;
    getCustomerBysearch(searchText: string, page: number, size: number): Observable<Page<Customer>>;
    getCustomersByDateRange(start: string, end: string, page: number, size: number): Observable<Page<Customer>>;
    getCustomersBySearchAndDate(searchText: string, start: string, end: string, page: number, size: number): Observable<Page<Customer>>;
    register(userData: Customer): Observable<any>;
    update(userId: number, userData: Customer): Observable<any>;
}
