import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Title } from '@angular/platform-browser'
import { catchError, EMPTY, startWith, switchMap } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { PageContainerComponent } from '../../../../shared/components/layouts/page-container/page-container.component'
import { StandartButtonComponent } from '../../../../shared/components/ui/standart-button/standart-button.component'
import { SellerAuthService } from '../../services/seller-auth.service'
import { SellerCabinetApiService } from '../../../../core/api/seller-cabinet/seller-cabinet-api.service'
import {
  ISellerPurchase,
  ISellerStore,
} from '../../../../core/api/seller-cabinet/models/seller-cabinet.api.interface'
import { ToastService } from '../../../../core/services/toast.service'
import { getErrorMessage } from '../../../../shared/utils/error-message.util'

@Component({
  selector: 'app-seller-purchases-page',
  standalone: true,
  imports: [PageContainerComponent, CommonModule, ReactiveFormsModule, RouterLink, StandartButtonComponent],
  templateUrl: './seller-purchases-page.component.html',
  styleUrl: './seller-purchases-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerPurchasesPageComponent implements OnInit {
  private sellerAuthService = inject(SellerAuthService)
  private sellerApi = inject(SellerCabinetApiService)
  private destroyRef = inject(DestroyRef)
  private toastService = inject(ToastService)
  private router = inject(Router)
  private title = inject(Title)

  public account = this.sellerAuthService.account
  public stores = signal<ISellerStore[]>([])
  public purchases = signal<ISellerPurchase[]>([])
  public storeControl = new FormControl<number | null>(null)

  ngOnInit(): void {
    this.title.setTitle('Покупки — кабинет продавца')
    this.loadStores()

    this.storeControl.valueChanges
      .pipe(
        startWith(this.storeControl.value),
        switchMap((storeId) =>
          this.sellerApi.getPurchases(storeId).pipe(
            catchError((error: HttpErrorResponse) => {
              if (error.status === 401) {
                this.sellerAuthService.clearSession()
                this.router.navigate(['/seller/login'])
              }
              this.toastService.error(getErrorMessage(error))
              return EMPTY
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((purchases) => this.purchases.set(purchases))
  }

  loadStores(): void {
    this.sellerApi
      .getStores()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          this.toastService.error(getErrorMessage(error))
          return EMPTY
        }),
      )
      .subscribe((stores) => this.stores.set(stores))
  }

  logout(): void {
    this.sellerAuthService
      .logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['/seller/login']))
  }

  paymentStatusLabel(status: string | null): string {
    switch (status) {
      case 'confirmed':
        return 'Оплачено'
      case 'authorized':
        return 'Авторизовано'
      case 'pending':
        return 'Ожидает'
      case 'cancelled':
        return 'Отменено'
      case 'refunded':
        return 'Возврат'
      case 'failed':
        return 'Ошибка'
      default:
        return status || '—'
    }
  }

  formatDate(value: string | null): string {
    if (!value) {
      return '—'
    }
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      return value
    }
    return date.toLocaleString('ru-RU')
  }
}
