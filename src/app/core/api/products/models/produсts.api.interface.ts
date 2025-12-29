import { BaseServerResponse } from '../../shared/models/responses/base-server-response.interface'
import { DTOProductType, productTypeDTO } from '../../product-types/models/product-types.api.interface'
import { IProduct } from '../../../models/product.interface'
export interface productDTO {
  id: number
  name: string
  price: number
  description?: string
  tax: string
  product_type: productTypeDTO
}
export interface IProductApiInterface extends BaseServerResponse<productDTO[]> {
  data: productDTO[]
}
export interface IProductApiInterfaceById extends BaseServerResponse<productDTO> {
  data: productDTO
}
export const DTOProduct = (productDTO: productDTO): IProduct => {
  return {
    id: productDTO.id,
    name: productDTO.name,
    price: productDTO.price / 100,
    description: productDTO.description,
    productType: DTOProductType(productDTO.product_type),
  }
}
export interface IProductFilter {
  productTypeId?: number
  name?: string
  price?: number
  tax?: string
  page?: number
  limit?: number
}
