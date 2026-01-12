import { PaymentStatus } from "../../features/purchase/models/payment-status";
import { IProduct } from "./product.interface";

export interface IPurchase {
    uuid: string,
    visitorUuid: string,
    finalPrice: number,
    products: IProduct[],
    paymentStatus: PaymentStatus,
    payerEmail: string,
    payerPhone: string,
    createdAt: string,
    updatedAt: string,
    paymentUrl: string,
    serviceFee: number,
}