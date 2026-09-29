import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Title } from '@angular/platform-browser'
import { catchError, debounceTime, distinctUntilChanged, EMPTY, startWith, switchMap } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { PageContainerComponent } from '../../../../shared/components/layouts/page-container/page-container.component'
import { StandartButtonComponent } from '../../../../shared/components/ui/standart-button/standart-button.component'
import { SellerAuthService } from '../../services/seller-auth.service'
import { SellerCabinetApiService } from '../../../../core/api/seller-cabinet/seller-cabinet-api.service'
import {
  ISellerDocument,
  ISellerProduct,
  ISellerStore,
} from '../../../../core/api/seller-cabinet/models/seller-cabinet.api.interface'
import { ToastService } from '../../../../core/services/toast.service'
import { getErrorMessage } from '../../../../shared/utils/error-message.util'

@Component({
  selector: 'app-seller-products-page',
  standalone: true,
  imports: [PageContainerComponent, CommonModule, ReactiveFormsModule, RouterLink, StandartButtonComponent],
  templateUrl: './seller-products-page.component.html',
  styleUrl: './seller-products-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerProductsPageComponent implements OnInit {
  private sellerAuthService = inject(SellerAuthService)
  private sellerApi = inject(SellerCabinetApiService)
  private destroyRef = inject(DestroyRef)
  private toastService = inject(ToastService)
  private router = inject(Router)
  private title = inject(Title)

  public account = this.sellerAuthService.account
  public stores = signal<ISellerStore[]>([])
  public products = signal<ISellerProduct[]>([])
  public documents = signal<ISellerDocument[]>([])
  public documentsTotal = signal(0)
  public exportingRegistry = signal(false)
  public storeControl = new FormControl<number | null>(null)
  public documentSearchControl = new FormControl('', { nonNullable: true })

  public exportForm = new FormGroup({
    dateFrom: new FormControl('', { nonNullable: true }),
    dateTo: new FormControl('', { nonNullable: true }),
  })

  ngOnInit(): void {
    this.title.setTitle('Товары — кабинет продавца')

    const accountStores = this.account()?.stores ?? []
    if (accountStores.length > 0) {
      this.stores.set(accountStores)
      this.storeControl.setValue(accountStores[0].id, { emitEvent: false })
    }

    this.loadStores()

    this.storeControl.valueChanges
      .pipe(
        startWith(this.storeControl.value),
        switchMap((storeId) =>
          this.sellerApi.getProducts(storeId).pipe(
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
      .subscribe((products) => this.products.set(products))

    this.documentSearchControl.valueChanges
      .pipe(
        startWith(this.documentSearchControl.value),
        debounceTime(700),
        distinctUntilChanged(),
        switchMap((query) => {
          const term = query.trim()
          if (term.length < 2) {
            this.documents.set([])
            this.documentsTotal.set(0)
            return EMPTY
          }

          return this.sellerApi
            .searchDocuments({
              q: term,
              storeId: this.storeControl.value,
              paymentStatus: 'confirmed',
              limit: 20,
            })
            .pipe(
              catchError((error: HttpErrorResponse) => {
                this.toastService.error(getErrorMessage(error))
                return EMPTY
              }),
            )
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((page) => {
        this.documents.set(page.items)
        this.documentsTotal.set(page.total)
      })
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
      .subscribe((stores) => {
        this.stores.set(stores)
        if (this.storeControl.value == null && stores.length > 0) {
          this.storeControl.setValue(stores[0].id)
        }
      })
  }

  exportStoreRegistry(): void {
    const storeId = this.storeControl.value
    if (!storeId) {
      this.toastService.error('Выберите магазин для выгрузки отчёта')
      return
    }

    const { dateFrom, dateTo } = this.exportForm.getRawValue()
    this.exportingRegistry.set(true)
    this.sellerApi
      .exportStoreSalesRegistry(storeId, {
        dateFrom: dateFrom || null,
        dateTo: dateTo || null,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          this.exportingRegistry.set(false)
          this.toastService.error(getErrorMessage(error))
          return EMPTY
        }),
      )
      .subscribe((blob) => {
        this.exportingRegistry.set(false)
        const storeName = this.stores().find((store) => store.id === storeId)?.name || String(storeId)
        this.saveBlob(blob, `store-sales-report-${storeName}.xlsx`)
        this.toastService.success('Отчёт по продажам скачан')
      })
  }

  async copyLicense(value: string | null): Promise<void> {
    if (!value) {
      return
    }
    try {
      await navigator.clipboard.writeText(value)
      this.toastService.success('Номер скопирован')
    } catch {
      this.toastService.error('Не удалось скопировать')
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

  logout(): void {
    this.sellerAuthService
      .logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['/seller/login']))
  }

  private saveBlob(blob: Blob, filename: string): void {
    const safeName = filename.replace(/[^\p{L}\p{N}._-]+/gu, '-')
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = safeName
    anchor.click()
    URL.revokeObjectURL(url)
  }
}
