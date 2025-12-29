import { IProductType } from "./product-type.interface";

export interface IProduct {
    id: number;
    name: string;
    price: number;
    description?: string;
    productType: IProductType;
}