import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, signal, Signal, untracked } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { PageContainerComponent } from '../../../../shared/components/layouts/page-container/page-container.component'
import { PaymentStatusModalComponent } from '../../components/payment-status-modal/payment-status-modal.component'
import { PaymentAction, PaymentStatus } from '../../models/payment-status'
import { PaymentStatusService } from '../../services/payment-status.service'
import { PurchasesApiService } from '../../../../core/api/purchases/purchases-api.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { catchError, EMPTY } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { ToastService } from '../../../../core/services/toast.service'
import { getErrorMessage } from '../../../../shared/utils/error-message.util'
import { BackButtonComponent } from '../../../../shared/components/ui/back-button/back-button.component'
import { Title } from '@angular/platform-browser'

import { LicensesGenerationApiService } from '../../../../core/api/license-generation/license-generation-api.service'
import { PAYMENT_STATUS_ACTIONS } from '../../constants/payment-status-actions'
@Component({
  selector: 'app-payment-status-page',
  standalone: true,
  imports: [CommonModule, PageContainerComponent, PaymentStatusModalComponent, BackButtonComponent],
  templateUrl: './payment-status-page.component.html',
  styleUrl: './payment-status-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentStatusPageComponent {
  constructor() {
    this.listenConfrimed()
  }
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private purchaseApiService = inject(PurchasesApiService)
  private destroyRef = inject(DestroyRef)
  private toastService = inject(ToastService)
  private title = inject(Title)
  private send: boolean = false
  private licensesGenerationApiService = inject(LicensesGenerationApiService)
  purchaseUuid = ''
  public paymentStatusService = inject(PaymentStatusService)
  public paymentStatusActions = PAYMENT_STATUS_ACTIONS
  navigateToPurchasePage(status: PaymentStatus): void {
    console.log(status)
    switch (status) {
      case 'confirmed':
        this.toastService.success('Платеж успешно завершен')
        break
      case 'pending':
        window.open(this.paymentStatusService.purchase()?.paymentUrl || '', '_blank')
        break
      case 'failed':
        this.router.navigate(['/'])
        break
      default:
        this.router.navigate(['/'])
        break
    }
  }
  getPaymentStatus() {
    return this.paymentStatusService.purchase()?.paymentStatus || 'pending'
  }
  listenConfrimed() {
    effect(() => {
      if (this.paymentStatusService.purchase()?.paymentStatus === 'confirmed' && !this.send) {
        console.log('отправляю на почту')
        this.send = true
        untracked(() => {
          this.licensesGenerationApiService
            .sendLicensesFile(this.purchaseUuid)
            .pipe(
              takeUntilDestroyed(this.destroyRef),
              catchError((error: HttpErrorResponse) => {
                console.error('Error creating purchase:', error)

                return EMPTY
              }),
            )
            .subscribe((response) => {
              if (response) {
                this.toastService.success('Товары отправлены на почту')
              }
            })
        })
      }
    })
  }
  getPaymentStatusActions() {
    return this.paymentStatusActions
  }
  setAction(action: PaymentAction) {
    this.paymentStatusService.getAction(action)
  }
  get purchaseProduct() {
    return this.paymentStatusService.purchase()?.products[0]
  }
  ngAfterViewInit(): void {
    this.purchaseApiService
      .getPurchaseByUuid(this.purchaseUuid)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          this.toastService.error(getErrorMessage(error))
          return EMPTY
        }),
      )
      .subscribe((purchase) => {
        if(purchase.paymentStatus == 'pending'){
          window.open(purchase.paymentUrl, '_blank')
        }
        this.paymentStatusService.purchase.set(purchase)
        this.paymentStatusService.startPaymentStatusCheck(this.purchaseUuid)
      })
  }

  ngOnInit(): void {
    this.purchaseUuid = this.route.snapshot.params['purchaseUuid']
    this.title.setTitle('Статус оплаты')
  }
  ngOnDestroy(): void {
    this.paymentStatusService.stopPaymentStatusCheck()
  }
}
