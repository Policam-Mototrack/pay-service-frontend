import { inject, Injectable, signal } from '@angular/core'
import { catchError, map, Observable, of, tap, throwError } from 'rxjs'
import { SellerCabinetApiService } from '../../../core/api/seller-cabinet/seller-cabinet-api.service'
import { ISellerAccount, ISellerLoginRequest } from '../../../core/api/seller-cabinet/models/seller-cabinet.api.interface'
import { ToastService } from '../../../core/services/toast.service'
import { getErrorMessage } from '../../../shared/utils/error-message.util'
import { HttpErrorResponse } from '@angular/common/http'

const SELLER_TOKEN_KEY = 'sellerAccessToken'
const SELLER_ACCOUNT_KEY = 'sellerAccount'

@Injectable({
  providedIn: 'root',
})
export class SellerAuthService {
  private api = inject(SellerCabinetApiService)
  private toastService = inject(ToastService)

  private accessToken = signal<string | null>(this.readToken())
  public account = signal<ISellerAccount | null>(this.readAccount())

  public getAccessToken(): string | null {
    return this.accessToken()
  }

  public isAuthenticated(): boolean {
    return !!this.accessToken()
  }

  public login(payload: ISellerLoginRequest): Observable<ISellerAccount> {
    return this.api.login(payload).pipe(
      tap((result) => {
        this.setSession(result.accessToken, result.account)
        this.toastService.success('Вход выполнен')
      }),
      map((result) => result.account),
      catchError((error: HttpErrorResponse) => {
        this.toastService.error(getErrorMessage(error))
        return throwError(() => error)
      }),
    )
  }

  public refreshMe(): Observable<ISellerAccount | null> {
    if (!this.isAuthenticated()) {
      return of(null)
    }

    return this.api.me().pipe(
      tap((account) => {
        this.account.set(account)
        localStorage.setItem(SELLER_ACCOUNT_KEY, JSON.stringify(account))
      }),
      catchError(() => {
        this.clearSession()
        return of(null)
      }),
    )
  }

  public logout(): Observable<unknown> {
    if (!this.isAuthenticated()) {
      this.clearSession()
      return of(null)
    }

    return this.api.logout().pipe(
      tap(() => this.clearSession()),
      catchError(() => {
        this.clearSession()
        return of(null)
      }),
    )
  }

  public clearSession(): void {
    localStorage.removeItem(SELLER_TOKEN_KEY)
    localStorage.removeItem(SELLER_ACCOUNT_KEY)
    this.accessToken.set(null)
    this.account.set(null)
  }

  private setSession(token: string, account: ISellerAccount): void {
    localStorage.setItem(SELLER_TOKEN_KEY, token)
    localStorage.setItem(SELLER_ACCOUNT_KEY, JSON.stringify(account))
    this.accessToken.set(token)
    this.account.set(account)
  }

  private readToken(): string | null {
    return localStorage.getItem(SELLER_TOKEN_KEY)
  }

  private readAccount(): ISellerAccount | null {
    const raw = localStorage.getItem(SELLER_ACCOUNT_KEY)
    if (!raw) {
      return null
    }

    try {
      return JSON.parse(raw) as ISellerAccount
    } catch {
      return null
    }
  }
}
