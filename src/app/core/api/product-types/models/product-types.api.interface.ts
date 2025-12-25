import { BaseServerResponse } from "../../shared/models/responses/base-server-response.interface";

export interface IProductTypeField{
    title: string;
    type: string;
}
export interface IProductType{
    id: number;
    name: string;
    fileds: IProductTypeField[];
}
export interface IProductTypeApiInterface extends BaseServerResponse<IProductType[]> {
    data: IProductType[];
}
export interface IProductTypeApiInterfaceById extends BaseServerResponse<IProductType> {
    data: IProductType;
}