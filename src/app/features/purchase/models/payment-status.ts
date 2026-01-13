import { IProduct } from "../../../core/models/product.interface"

export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled' | 'authorized'
export type ActionsIds = 'download' | 'resetEmail'
export type PaymentAction = {
  text: string
  theme?: 'primary' | 'secondary' | 'tertiary'
  action: ActionsIds
  data?: { uuid: string, product?:IProduct }
}
export interface PaymentStatusActions {
  confirmed?: PaymentAction[]
  failed?: PaymentAction[]
  cancelled?: PaymentAction[]
  authorized?: PaymentAction[]
  pending?: PaymentAction[]
}
