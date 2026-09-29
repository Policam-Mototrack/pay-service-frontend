import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Title } from '@angular/platform-browser'
import { catchError, EMPTY } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { PageContainerComponent } from '../../../../shared/components/layouts/page-container/page-container.component'
import { BackButtonComponent } from '../../../../shared/components/ui/back-button/back-button.component'
import { StandartButtonComponent } from '../../../../shared/components/ui/standart-button/standart-button.component'
import { SellerCabinetApiService } from '../../../../core/api/seller-cabinet/seller-cabinet-api.service'
import {
  ISellerPurchase,
  ISellerPurchaseProduct,
  SellerStoreRole,
} from '../../../../core/api/seller-cabinet/models/seller-cabinet.api.interface'
import { SellerAuthService } from '../../services/seller-auth.service'
import { ToastService } from '../../../../core/services/toast.service'
import { getErrorMessage } from '../../../../shared/utils/error-message.util'

@Component({
  selector: 'app-seller-purchase-detail-page',
  standalone: true,
  imports: [PageContainerComponent, BackButtonComponent, StandartButtonComponent, CommonModule],
  templateUrl: './seller-purchase-detail-page.component.html',
  styleUrl: './seller-purchase-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerPurchaseDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private sellerApi = inject(SellerCabinetApiService)
  private sellerAuthService = inject(SellerAuthService)
  private toastService = inject(ToastService)
  private destroyRef = inject(DestroyRef)
  private title = inject(Title)

  public purchase = signal<ISellerPurchase | null>(null)
  public downloadingProductId = signal<number | null>(null)

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid')
    if (!uuid) {
      this.router.navigate(['/seller/purchases'])
      return
    }

    this.title.setTitle(`Покупка ${uuid}`)
    this.loadPurchase(uuid)
  }

  loadPurchase(uuid: string): void {
    this.sellerApi
      .getPurchase(uuid)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.sellerAuthService.clearSession()
            this.router.navigate(['/seller/login'])
          }
          this.toastService.error(getErrorMessage(error))
          return EMPTY
        }),
      )
      .subscribe((purchase) => this.purchase.set(purchase))
  }

  canDownload(product: ISellerPurchaseProduct): boolean {
    if (!product.hasLicensePdf) {
      return false
    }

    const account = this.sellerAuthService.account()
    if (!account || !product.storeIdAtPurchase) {
      return false
    }

    const store = account.stores.find((item) => item.id === product.storeIdAtPurchase)
    if (!store) {
      return false
    }

    return this.roleCanDownload(store.role)
  }

  downloadLicense(product: ISellerPurchaseProduct): void {
    const purchase = this.purchase()
    if (!purchase || !this.canDownload(product)) {
      return
    }

    this.downloadingProductId.set(product.id)
    this.sellerApi
      .downloadProductLicense(purchase.uuid, product.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          this.downloadingProductId.set(null)
          this.toastService.error(getErrorMessage(error))
          return EMPTY
        }),
      )
      .subscribe((blob) => {
        this.downloadingProductId.set(null)
        this.saveBlob(blob, `license-${purchase.uuid}-${product.id}.pdf`)
        this.toastService.success('PDF скачан')
      })
  }

  productFieldsEntries(product: ISellerPurchaseProduct): Array<{ key: string; value: string }> {
    if (!product.productFields) {
      return []
    }

    return Object.entries(product.productFields).map(([key, value]) => ({
      key,
      value: value == null ? '—' : String(value),
    }))
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

  private roleCanDownload(role: SellerStoreRole): boolean {
    return role === 'owner' || role === 'manager' || role === 'service'
  }

  private saveBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(url)
  }
}
