import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { CommonModule } from '@angular/common'

export type PaymentStatus = 'pending' | 'confirmed' | 'failed'|'cancelled' | 'authorized'

@Component({
  selector: 'app-payment-status-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-status-modal.component.html',
  styleUrl: './payment-status-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentStatusModalComponent {
  status = input<PaymentStatus>('pending')
  email = input<string>('')
  statusText = input<string>('')
  onReturnHome = output<void>()

  getStatusConfig() {
    switch (this.status()) {
      case 'confirmed':
        return {
          title: 'Оплата успешно завершена',
          description: `Ваш заказ успешно оплачен. Информация о товаре отправлена на email ${this.email() || 'arsipooshka@gmail.com'}`,
          buttonText: 'Вернуться на главную',
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
          description: `Деньги зарезервированы на вашей карте. Ожидайте подтверждения платежа. Информация о товаре будет отправлена на email ${this.email() || 'arsipooshka@gmail.com'} после подтверждения.`,
          buttonText: 'Вернуться на главную',
          showWarning: true,
        }
      default: // pending
        return {
          title: 'Ожидание оплаты',
          description: `Ваш заказ обрабатывается. Вы получите ваш товар на email ${this.email() || 'arsipooshka@gmail.com'} после оплаты.`,
          buttonText: 'Вернуться на главную',
          showWarning: true,
        }
    }
  }

  handleReturnHome(): void {
    this.onReturnHome.emit()
  }
}

