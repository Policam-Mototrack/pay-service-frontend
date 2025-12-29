import { IProduct } from "./product.interface";

export interface IPurchase {
    uuid: string,
    visitorUuid: string,
    finalPrice: number,
    products: IProduct[],
    createdAt: string,
    updatedAt: string,
}