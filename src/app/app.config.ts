import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'
import { HttpInterceptorFn, provideHttpClient } from '@angular/common/http'
import { routes } from './routes/app.routes'
import { withInterceptors } from '@angular/common/http'
import { LoaderInterceptor } from './core/interceptors/loader-interceptor'
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideHttpClient(withInterceptors([LoaderInterceptor])),
  ],
}
