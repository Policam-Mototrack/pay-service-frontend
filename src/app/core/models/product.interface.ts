import { IProductType } from "./product-type.interface";

export interface IProduct {
    id: number;
    name: string;
    price: number;
    description?: string;
    isVisible:boolean,
    isUrl:boolean,
    url:string|null,
    productType: IProductType;
}