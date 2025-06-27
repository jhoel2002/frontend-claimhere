import { InjectionToken } from "@angular/core";
import { IUserService } from "../services-admin/user/IUserService";
import { ICustomerService } from "../services-admin/customer/ICustomerService";
import { IRequestService } from "../services-admin/request/IRequest.service";
import { ILawyerService } from "../services-admin/lawyer/ILawyer.service";
import { IDocumentService } from "../services-admin/document/IDocumentService";
import { IAuthService } from "../services-admin/auth/IAuth.service";
import { IBuffetService } from "../services-admin/buffet/IBuffet.service";
import { IDashboardBuffet } from "../services-admin/dashboard-buffet/IDashboard-buffet.service";

export const USER_SERVICE_TOKEN = new InjectionToken<IUserService>('UserDataService');
export const CUSTOMER_SERVICE_TOKEN = new InjectionToken<ICustomerService>('CustomerDataService');
export const REQUEST_SERVICE_TOKEN = new InjectionToken<IRequestService>('RequestDataService');
export const LAWYER_SERVICE_TOKEN = new InjectionToken<ILawyerService>('LaywerDataService');
export const DOCUMENT_SERVICE_TOKEN = new InjectionToken<IDocumentService>('DocumentService');
export const AUTH_SERVICE_TOKEN = new InjectionToken<IAuthService>('AuthService');
export const BUFFET_SERVICE_TOKEN = new InjectionToken<IBuffetService>('BuffetService');
export const DASHBOARD_SERVICE_TOKEN = new InjectionToken<IDashboardBuffet>('DashboardService');