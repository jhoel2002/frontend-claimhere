import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { loadingInterceptor } from './core/services-admin/intercerptor/loading.Interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '../environments/environment';
import { UserSimulationService } from './core/services-admin/user/user-simulation.service';
import { UserService } from './core/services-admin/user/user.service';
import { AUTH_SERVICE_TOKEN, BUFFET_SERVICE_TOKEN, CUSTOMER_SERVICE_TOKEN, DASHBOARD_SERVICE_TOKEN, DOCUMENT_SERVICE_TOKEN, LAWYER_SERVICE_TOKEN, REQUEST_SERVICE_TOKEN, USER_SERVICE_TOKEN } from './core/models/token-injection.model';
import { CustomerService } from './core/services-admin/customer/customer.service';
import { CustomerSimulationService } from './core/services-admin/customer/customer-simulation.service';
import { RequestSimulationService } from './core/services-admin/request/request-simulation.service';
import { RequestService } from './core/services-admin/request/request.service';
import { LawyerService } from './core/services-admin/lawyer/lawyer.service';
import { LawyerSimulationService } from './core/services-admin/lawyer/lawyer-simulation.service';
import { DocumentSimulationService } from './core/services-admin/document/document-simulation.service';
import { DocumentService } from './core/services-admin/document/document.service';
import { AuthSimulationService } from './core/services-admin/auth/auth-simulation.service';
import { AuthService } from './core/services-admin/auth/auth.service';
import { BuffetSimulationService } from './core/services-admin/buffet/buffet-simulation.service';
import { BuffetService } from './core/services-admin/buffet/buffet.service';
import { DashboardBuffetSimulationService } from './core/services-admin/dashboard-buffet/dashboard-buffet-simulation.service';
import { DashboardBuffetService } from './core/services-admin/dashboard-buffet/dashboard-buffet.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withInterceptors([loadingInterceptor])),
    importProvidersFrom(BrowserAnimationsModule), provideAnimationsAsync(),
    {
      provide: AUTH_SERVICE_TOKEN,
      useClass: environment.useMock ? AuthSimulationService : AuthService
    },
    {
      provide: USER_SERVICE_TOKEN,
      useClass: environment.useMock ? UserSimulationService : UserService
    },
    {
      provide: CUSTOMER_SERVICE_TOKEN,
      useClass: environment.useMock ? CustomerSimulationService : CustomerService
    },
    {
      provide: REQUEST_SERVICE_TOKEN,
      useClass: environment.useMock ? RequestSimulationService : RequestService
    },
    {
      provide: LAWYER_SERVICE_TOKEN,
      useClass: environment.useMock ? LawyerSimulationService : LawyerService
    },
    {
      provide: DOCUMENT_SERVICE_TOKEN,
      useClass: environment.useMock ? DocumentSimulationService : DocumentService
    },
    {
      provide: BUFFET_SERVICE_TOKEN,
      useClass: environment.useMock ? BuffetSimulationService : BuffetService
    },
    {
      provide: DASHBOARD_SERVICE_TOKEN,
      useClass: environment.useMock ? DashboardBuffetSimulationService : DashboardBuffetService
    }
  ]
};
