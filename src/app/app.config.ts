import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { routes } from './app.routes'
import { LoaderInterceptor } from './core/interceptors/loader-interceptor'
import { SellerAuthInterceptor } from './core/interceptors/seller-auth.interceptor'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([LoaderInterceptor, SellerAuthInterceptor])),
  ],
}
