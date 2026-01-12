import { PaymentStatusActions } from "../models/payment-status"
export const PAYMENT_STATUS_ACTIONS: PaymentStatusActions = {
  confirmed: [
    {
      text: 'Скачать товар',
      theme: 'primary',
      action:'download'
    },
    {
      text: 'Отпарвить на почту еще раз',
      theme: 'secondary',
      action:'reset_email'
    },
  ],
}
