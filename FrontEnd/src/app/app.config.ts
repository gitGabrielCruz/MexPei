import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { fn_InterceptorJwt } from './core/interceptors/fn_InterceptorJwt';

import { rutas } from './vr_RutasApp';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(rutas),
    provideHttpClient(withInterceptors([fn_InterceptorJwt]))
  ]
};
