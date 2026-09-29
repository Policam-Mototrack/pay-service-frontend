import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Title } from '@angular/platform-browser'
import { catchError, debounceTime, distinctUntilChanged, EMPTY, merge, startWith, Subject, switchMap, tap } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { PageContainerComponent } from '../../../../shared/components/layouts/page-container/page-container.component'
import { BackButtonComponent } from '../../../../shared/components/ui/back-button/back-button.component'
import { StandartButtonComponent } from '../../../../shared/components/ui/standart-button/standart-button.component'
import { SellerCabinetApiService } from '../../../../core/api/seller-cabinet/seller-cabinet-api.service'
import {
  ISellerProduct,
  ISellerProductSale,
  SellerStoreRole,
} from '../../../../core/api/seller-cabinet/models/seller-cabinet.api.interface'
import { SellerAuthService } from '../../services/seller-auth.service'
import { ToastService } from '../../../../core/services/toast.service'
import { getErrorMessage } from '../../../../shared/utils/error-message.util'

@Component({
  selector: 'app-seller-product-sales-page',
  standalone: true,
  imports: [
    PageContainerComponent,
    BackButtonComponent,
    StandartButtonComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './seller-product-sales-page.component.html',
  styleUrl: './seller-product-sales-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerProductSalesPageComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private sellerApi = inject(SellerCabinetApiService)
  private sellerAuthService = inject(SellerAuthService)
  private toastService = inject(ToastService)
  private destroyRef = inject(DestroyRef)
  private title = inject(Title)

  private reload$ = new Subject<void>()

  public product = signal<ISellerProduct | null>(null)
  public sales = signal<ISellerProductSale[]>([])
  public total = signal(0)
  public page = signal(0)
  public pageSize = 50
  public sort = signal('-purchased_at')
  public downloadingSaleId = signal<number | null>(null)
  public exporting = signal(false)
  private productId = 0

  public fieldKeys = computed(() => this.product()?.fieldKeys ?? [])
  public totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize)))

  public filtersForm = new FormGroup({
    q: new FormControl('', { nonNullable: true }),
    licenseNumber: new FormControl('', { nonNullable: true }),
    dateFrom: new FormControl('', { nonNullable: true }),
    dateTo: new FormControl('', { nonNullable: true }),
    paymentStatus: new FormControl('confirmed', { nonNullable: true }),
  })

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    if (!id) {
      this.router.navigate(['/seller/products'])
      return
    }

    this.productId = id
    this.loadProduct(id)

    const filters$ = this.filtersForm.valueChanges.pipe(
      startWith(this.filtersForm.getRawValue()),
      debounceTime(700),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      tap(() => this.page.set(0)),
    )

    merge(filters$, this.reload$)
      .pipe(
        switchMap(() => {
          const filters = this.filtersForm.getRawValue()
          return this.sellerApi
            .getProductSales(this.productId, {
              q: filters.q?.trim() || null,
              licenseNumber: filters.licenseNumber?.trim() || null,
              dateFrom: filters.dateFrom || null,
              dateTo: filters.dateTo || null,
              paymentStatus: filters.paymentStatus || null,
              sort: this.sort(),
              offset: this.page() * this.pageSize,
              limit: this.pageSize,
            })
            .pipe(
              catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                  this.sellerAuthService.clearSession()
                  this.router.navigate(['/seller/login'])
                }
                this.toastService.error(getErrorMessage(error))
                return EMPTY
              }),
            )
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        this.sales.set(result.items)
        this.total.set(result.total)
      })
  }

  loadProduct(id: number): void {
    this.sellerApi
      .getProduct(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          this.toastService.error(getErrorMessage(error))
          this.router.navigate(['/seller/products'])
          return EMPTY
        }),
      )
      .subscribe((product) => {
        this.product.set(product)
        this.title.setTitle(`${product.name} — реестр документов`)
      })
  }

  resetFilters(): void {
    this.filtersForm.reset({
      q: '',
      licenseNumber: '',
      dateFrom: '',
      dateTo: '',
      paymentStatus: 'confirmed',
    })
  }

  setSort(field: string): void {
    const current = this.sort()
    if (current === `-${field}`) {
      this.sort.set(field)
    } else {
      this.sort.set(`-${field}`)
    }
    this.page.set(0)
    this.reload$.next()
  }

  sortIndicator(field: string): string {
    const current = this.sort()
    if (current === field) {
      return '↑'
    }
    if (current === `-${field}`) {
      return '↓'
    }
    return ''
  }

  prevPage(): void {
    if (this.page() <= 0) {
      return
    }
    this.page.update((value) => value - 1)
    this.reload$.next()
  }

  nextPage(): void {
    if (this.page() + 1 >= this.totalPages()) {
      return
    }
    this.page.update((value) => value + 1)
    this.reload$.next()
  }

  fieldValue(sale: ISellerProductSale, key: string): string {
    const value = sale.productFields?.[key]
    if (value == null || value === '') {
      return '—'
    }
    return String(value)
  }

  canDownload(sale: ISellerProductSale): boolean {
    if (!sale.hasLicensePdf) {
      return false
    }

    const account = this.sellerAuthService.account()
    if (!account || !sale.storeIdAtPurchase) {
      return false
    }

    const store = account.stores.find((item) => item.id === sale.storeIdAtPurchase)
    return !!store && this.roleCanDownload(store.role)
  }

  downloadLicense(sale: ISellerProductSale): void {
    if (!this.canDownload(sale)) {
      return
    }

    this.downloadingSaleId.set(sale.id)
    this.sellerApi
      .downloadProductLicense(sale.purchaseUuid, sale.productId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          this.downloadingSaleId.set(null)
          this.toastService.error(getErrorMessage(error))
          return EMPTY
        }),
      )
      .subscribe((blob) => {
        this.downloadingSaleId.set(null)
        this.saveBlob(blob, `license-${sale.licenseNumber || sale.purchaseUuid}.pdf`)
        this.toastService.success('PDF скачан')
      })
  }

  exportExcel(): void {
    const filters = this.filtersForm.getRawValue()
    this.exporting.set(true)
    this.sellerApi
      .exportProductSales(this.productId, {
        q: filters.q?.trim() || null,
        licenseNumber: filters.licenseNumber?.trim() || null,
        dateFrom: filters.dateFrom || null,
        dateTo: filters.dateTo || null,
        paymentStatus: filters.paymentStatus || null,
        sort: this.sort(),
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          this.exporting.set(false)
          this.toastService.error(getErrorMessage(error))
          return EMPTY
        }),
      )
      .subscribe((blob) => {
        this.exporting.set(false)
        this.saveBlob(blob, `product-registry-${this.productId}.xlsx`)
        this.toastService.success('Excel скачан')
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
