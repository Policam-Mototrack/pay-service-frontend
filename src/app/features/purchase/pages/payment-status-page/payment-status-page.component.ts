import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal, Signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { PageContainerComponent } from '../../../../shared/components/layouts/page-container/page-container.component'
import { PaymentStatusModalComponent, PaymentStatus } from '../../components/payment-status-modal/payment-status-modal.component'
import { PaymentStatusService } from '../../services/payment-status.service'
import { PurchasesApiService } from '../../../../core/api/purchases/purchases-api.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { catchError, EMPTY } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { ToastService } from '../../../../core/services/toast.service'
import { getErrorMessage } from '../../../../shared/utils/error-message.util'
import { BackButtonComponent } from '../../../../shared/components/ui/back-button/back-button.component'
import { Title } from '@angular/platform-browser'

@Component({
  selector: 'app-payment-status-page',
  standalone: true,
  imports: [CommonModule, PageContainerComponent, PaymentStatusModalComponent, BackButtonComponent],
  templateUrl: './payment-status-page.component.html',
  styleUrl: './payment-status-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentStatusPageComponent {
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private purchaseApiService = inject(PurchasesApiService)
  private destroyRef = inject(DestroyRef)
  private toastService = inject(ToastService)
  private getErrorMessage = getErrorMessage
  private title = inject(Title)
  purchaseUuid = ''
  public paymentStatusService = inject(PaymentStatusService)
  navigateToPurchasePage(status: PaymentStatus): void {
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
        window.open(purchase.paymentUrl, '_blank')
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
