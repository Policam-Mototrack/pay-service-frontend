import { IProductType } from "../../product-types/models/product-types.api.interface";
import { BaseServerResponse } from "../../shared/models/responses/base-server-response.interface";

export interface IProduct {
    id: number;
    name: string;
    price: number;
    tax:string;
    productType: IProductType;
}
export interface IProductApiInterface extends BaseServerResponse<IProduct[]> {
    data: IProduct[];
}
export interface IProductApiInterfaceById extends BaseServerResponse<IProduct> {
    data: IProduct;
}
export interface IProductFilter {
    productTypeId?: number;
    name?: string;
    price?: number;
    tax?: string;
    page?: number;
    limit?: number;
}