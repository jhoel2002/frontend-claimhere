import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  constructor(private authService:AuthService) { }

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   if (!this.authService.isTokenValid()) {
  //     this.authService.logout();
  //   }
  //   let token:string | null = localStorage.getItem("token");
  //   if (token!=null){
  //     req=req.clone(
  //       {
  //         setHeaders: {
  //           'Content-Type': 'application/json; charset=utf-8',
  //           'Accept': 'application/json',
  //           'Authorization': `Bearer ${token}`,
  //         },
  //       }
  //     );
  //   }
  //   return next.handle(req);
  // }
}
