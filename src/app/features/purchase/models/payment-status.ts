export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled' | 'authorized'
export type ActionsIds = 'download' | 'reset_email'
export type PaymentAction = {
  text: string
  theme?: 'primary' | 'secondary' | 'tertiary'
  action: ActionsIds
  data?: { uuid: string }
}
export interface PaymentStatusActions {
  confirmed?: PaymentAction[]
  failed?: PaymentAction[]
  cancelled?: PaymentAction[]
  authorized?: PaymentAction[]
  pending?: PaymentAction[]
}
