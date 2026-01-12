import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { StandartButtonComponent } from '../../../../shared/components/ui/standart-button/standart-button.component'
import { PaymentAction } from '../../models/payment-status'
import { PaymentStatus } from '../../models/payment-status'
import { IPurchase } from '../../../../core/models/purchase.interface'

@Component({
  selector: 'app-payment-status-modal',
  standalone: true,
  imports: [CommonModule, StandartButtonComponent],
  templateUrl: './payment-status-modal.component.html',
  styleUrl: './payment-status-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentStatusModalComponent {
  status = input<PaymentStatus | undefined>(undefined)
  email = input<string | undefined>(undefined)
  purchaseUuid = input<string | undefined>(undefined)
  getAction = output<PaymentAction>()
  statusText = input<string>('')
  statusActions = input<{
    confirmed?: PaymentAction[]
    failed?: PaymentAction[]
    cancelled?: PaymentAction[]
    authorized?: PaymentAction[]
    pending?: PaymentAction[]
  }>()
  onPurchasePageClick = output<PaymentStatus>()

  getStatusActions() {
    return this.statusActions()?.[this.status() || 'pending'] || []
  }

  emitAction(action: PaymentAction) {
    this.getAction.emit({
      ...action,
      data: { uuid: this?.purchaseUuid() || '' },
    })
  }

  getStatusConfig() {
    switch (this.status()) {
      case 'confirmed':
        return {
          title: 'Оплата успешно завершена',
          description: `Ваш заказ успешно оплачен. Информация о товаре отправлена на email ${this.email() || 'arsipooshka@gmail.com'}`,
          buttonText: 'На страницу покупки',
          showWarning: false,
        }
      case 'failed':
        return {
          title: 'Ошибка оплаты',
          description: 'Произошла ошибка при обработке платежа. Пожалуйста, попробуйте еще раз.',
          buttonText: 'Вернуться на главную',
          showWarning: false,
        }
      case 'cancelled':
        return {
          title: 'Покупка отменена',
          description: 'Ваша покупка была отменена. Если деньги были списаны, они будут возвращены в течение нескольких рабочих дней.',
          buttonText: 'Вернуться на главную',
          showWarning: false,
        }
      case 'authorized':
        return {
          title: 'Платеж авторизован',
          description: `Деньги зарезервированы на вашей карте. Ожидайте подтверждения платежа. Информация о товаре будет отправлена на email ${
            this.email() || 'arsipooshka@gmail.com'
          } после подтверждения.`,
          buttonText: 'Вернуться на главную',
          showWarning: true,
        }
      default:
        return {
          title: 'Ожидание оплаты',
          description: `Ваш заказ обрабатывается. Вы получите ваш товар на email ${this.email() || 'arsipooshka@gmail.com'} после оплаты.`,
          buttonText: 'Оплатить',
          showWarning: true,
        }
    }
  }

  handleReturnHome(status: PaymentStatus): void {
    this.onPurchasePageClick.emit(status)
  }
}
