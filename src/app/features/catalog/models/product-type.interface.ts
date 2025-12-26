export interface IProductTypeField{
    title: string;
    type: string;
}
export interface IProductType{
    id: number;
    name: string;
    fileds: IProductTypeField[];
}