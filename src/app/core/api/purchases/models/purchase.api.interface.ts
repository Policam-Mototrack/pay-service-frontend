import { DTOProduct, productDTO } from "../../products/models/produсts.api.interface";
import { BaseServerResponse } from "../../shared/models/responses/base-server-response.interface";
import { IPurchase } from "../../../models/purchase.interface";
export interface purchaseDTO{
    uuid: string,
    visitor_uuid: string,
    final_price: number,
    products:productDTO[],
    created_at: string,
    updated_at: string,
}

export interface IPurchaseApiInterface extends BaseServerResponse<purchaseDTO[]> {
    data: purchaseDTO[]
}  
export interface IPurchaseApiInterfaceById extends BaseServerResponse<purchaseDTO> {
    data: purchaseDTO
}
export interface ICreatePurchase {
    visitor_uuid: string,
    products:[
        {
            product_id: number,
            fields: {
                [key: string]: string | number | boolean | Date
            }
        }
    ]
}
export const DTOPurchase = (purchaseDTO: purchaseDTO): IPurchase => {
    return {
        uuid: purchaseDTO.uuid,
        visitorUuid: purchaseDTO.visitor_uuid,
        finalPrice: purchaseDTO.final_price/100,
        products: purchaseDTO.products.map(DTOProduct),
        createdAt: purchaseDTO.created_at,
        updatedAt: purchaseDTO.updated_at,
    }
}
