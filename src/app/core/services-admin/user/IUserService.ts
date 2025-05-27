import { Observable } from "rxjs";
import { User } from "../../models/user.model";
import { Page } from "../../models/pageable.model";

export interface IUserService {
  getAll(page: number, size: number): Observable<Page<User>>;
  search(searchText: string, page: number, size: number): Observable<Page<User>>;
  getUsersByDateRange(start: string, end: string, page: number, size: number): Observable<Page<User>>;
  getUsersBySearchAndDate(searchText: string, start: string, end: string, page: number, size: number): Observable<Page<User>>;
  register(userData: User): Observable<any>;
  update(userId: number, userData: User): Observable<any>;
}