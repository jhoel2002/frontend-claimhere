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
import { CUSTOMER_SERVICE_TOKEN, REQUEST_SERVICE_TOKEN, USER_SERVICE_TOKEN } from './core/models/token-injection.model';
import { CustomerService } from './core/services-admin/customer/customer.service';
import { CustomerSimulationService } from './core/services-admin/customer/customer-simulation.service';
import { RequestSimulationService } from './core/services-admin/request/request-simulation.service';
import { RequestService } from './core/services-admin/request/request.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withInterceptors([loadingInterceptor])),
    importProvidersFrom(BrowserAnimationsModule), provideAnimationsAsync(),
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
  ]
};
