import { inject, Injectable, Signal, signal } from '@angular/core'
import { AnonymousAuthApiService } from '../../../../core/api/auth/anonymous-auth-api.service'
import { catchError, map, Observable, of } from 'rxjs'
import { AnonymousAuthApiInterface } from '../../../../core/api/auth/models/anonymous-auth.api.interface'
import { ToastService } from '../../../../core/services/toast.service'
@Injectable({
  providedIn: 'root',
})
export class AnonymousAuthService {
  private authToken = signal<string | null>(this.getAuthTokenFromLocalStorage())
  private uuid = signal<string | null>(this.getUuidFromLocalStorage())
  private anonymousAuthApiService = inject(AnonymousAuthApiService)
  private toastService = inject(ToastService)
  private getAuthTokenFromLocalStorage(): string | null {
    return localStorage.getItem('authToken') || null
  }
  private getUuidFromLocalStorage(): string | null {
    return localStorage.getItem('uuid') || null
  }
  private setAuthTokenToLocalStorage(authToken: string): void {
    localStorage.setItem('authToken', authToken)
  }
  private setUuidToLocalStorage(uuid: string): void {
    localStorage.setItem('uuid', uuid)
    this.uuid.set(uuid)
  }
  public isAuthenticated(): boolean {
    return this.authToken() !== null && this.uuid() !== null
  }
  public logout(): void {
    localStorage.removeItem('authToken')
    this.authToken.set(null)
    localStorage.removeItem('uuid')
    this.uuid.set(null)
  }
  public register(): Observable<AnonymousAuthApiInterface | null> {
    return this.anonymousAuthApiService.createAnonymousAuth().pipe(
      map((response) => {
        this.setAuthTokenToLocalStorage(response.data.token)
        this.authToken.set(response.data.token)
        this.setUuidToLocalStorage(response.data.uuid)
        this.uuid.set(response.data.uuid)
        this.toastService.success('Вы успешно авторизовались')
        return response
      }),
      catchError((error) => {
        return of(null)
      }),
    )
  }

  public initAnonymousAuth(): Observable<AnonymousAuthApiInterface | string | null> {
    if (this.isAuthenticated()) {
      this.toastService.success('Вы успешно авторизовались')
      return of('authenticated')
    }
    return this.register()
  }
}
