import { IProductType } from "../../../../features/catalog/models/product-type.interface";
import { BaseServerResponse } from "../../shared/models/responses/base-server-response.interface";

export interface productTypeDTO{
    id: number;
    name: string;
    fileds: {
        title: string;
        type: string;
    }[];
}

export interface IProductTypeApiInterface extends BaseServerResponse<productTypeDTO[]> {
    data: productTypeDTO[];
}
export interface IProductTypeApiInterfaceById extends BaseServerResponse<productTypeDTO> {
    data: productTypeDTO;
}

export const DTOProductType = (productTypeDTO: productTypeDTO): IProductType => {
    return {
        id: productTypeDTO.id,
        name: productTypeDTO.name,
        fileds: productTypeDTO.fileds,
    }
}