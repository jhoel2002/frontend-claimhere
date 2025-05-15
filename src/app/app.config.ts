import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { loadingInterceptor } from './core/core-admin/services-admin/intercerptor/loading.Interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withInterceptors([loadingInterceptor])),
    importProvidersFrom(BrowserAnimationsModule)

  ]
};
