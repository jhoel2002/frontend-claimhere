import { InjectionToken } from "@angular/core";
import { IUserService } from "../services-admin/user/IUserService";
import { ICustomerService } from "../services-admin/customer/ICustomerService";
import { IRequestService } from "../services-admin/request/IRequest.service";

export const USER_SERVICE_TOKEN = new InjectionToken<IUserService>('UserDataService');
export const CUSTOMER_SERVICE_TOKEN = new InjectionToken<ICustomerService>('CustomerDataService');
export const REQUEST_SERVICE_TOKEN = new InjectionToken<IRequestService>('RequestDataService'); // Assuming a similar interface for cases