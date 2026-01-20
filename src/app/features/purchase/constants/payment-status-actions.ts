import { PaymentStatusActions } from '../models/payment-status'
export const PAYMENT_STATUS_ACTIONS: PaymentStatusActions = {
  confirmed: [
    {
      text: 'Скачать товар',
      theme: 'primary',
      action: 'download',
    },
    {
      text: 'Отправить на почту еще раз',
      theme: 'secondary',
      action: 'resetEmail',
    },
  ],
  pending: [
    {
      text: 'Перейти к оплате',
      theme: 'tertiary',
      action: 'redirectToPay',
    },
  ],
}
