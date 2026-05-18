import { IAdditionalAgreement } from './additional-agreement.interface'
import { IProductType } from "./product-type.interface";

export interface IProduct {
    id: number;
    name: string;
    price: number;
    minPrice?: boolean;
    description?: string;
    isVisible:boolean,
    isUrl:boolean,
    url:string|null,
    offerUrl?: string | null;
    additionalAgreements?: IAdditionalAgreement[];
    imageUrl:string|null
    productType: IProductType;
}