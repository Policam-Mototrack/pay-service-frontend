import { PaymentStatus } from "../../features/purchase/components/payment-status-modal/payment-status-modal.component";
import { IProduct } from "./product.interface";

export interface IPurchase {
    uuid: string,
    visitorUuid: string,
    finalPrice: number,
    products: IProduct[],
    paymentStatus: PaymentStatus,
    createdAt: string,
    updatedAt: string,
}