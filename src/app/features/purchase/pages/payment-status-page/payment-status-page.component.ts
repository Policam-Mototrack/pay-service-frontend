import { ChangeDetectionStrategy, Component, inject, input, signal, Signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { PageContainerComponent } from '../../../../shared/components/layouts/page-container/page-container.component'
import { PaymentStatusModalComponent, PaymentStatus } from '../../components/payment-status-modal/payment-status-modal.component'
import { PaymentStatusService } from '../../services/payment-status.service'

@Component({
  selector: 'app-payment-status-page',
  standalone: true,
  imports: [CommonModule, PageContainerComponent, PaymentStatusModalComponent],
  templateUrl: './payment-status-page.component.html',
  styleUrl: './payment-status-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentStatusPageComponent {
  email = input<string>('')
  status = input<string>('Ожидание оплаты...')
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  public paymentStatus = signal<PaymentStatus>('authorized')
  purchaseUuid = ''
  private paymentStatusService = inject(PaymentStatusService)
  returnToHome(): void {
    this.router.navigate(['/'])
  }

  ngOnInit(): void {
    this.purchaseUuid = this.route.snapshot.params['purchaseUuid']
    if (this.purchaseUuid) {
      this.paymentStatusService.startPaymentStatusCheck(this.purchaseUuid)
    } 
  }
  ngOnDestroy(): void {
    this.paymentStatusService.stopPaymentStatusCheck()
  }
}
