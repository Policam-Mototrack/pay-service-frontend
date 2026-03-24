import { BaseServerResponse } from '../../shared/models/responses/base-server-response.interface'
import { DTOProductType, productTypeDTO } from '../../product-types/models/product-types.api.interface'
import { IProduct } from '../../../models/product.interface'
export interface productDTO {
  id: number
  name: string
  price: number
  min_price?: boolean
  description?: string
  tax: string,
  product_type: productTypeDTO,
  is_visible:boolean,
  is_url:boolean,
  url:string|null,
  offer_url?: string | null,
}
export interface IProductApiInterface extends BaseServerResponse<productDTO[]> {
  data: productDTO[]
}
export interface IProductApiInterfaceById extends BaseServerResponse<productDTO> {
  data: productDTO
}
export const DTOProduct = (productDTO: productDTO): IProduct => {
  return {
    id: productDTO?.id,
    name: productDTO?.name,
    price: productDTO?.price / 100,
    minPrice: productDTO?.min_price,
    description: productDTO?.description,
    productType: DTOProductType(productDTO?.product_type),
    isUrl:productDTO?.is_url,
    url:productDTO?.url,
    offerUrl: productDTO?.offer_url,
    isVisible:productDTO?.is_visible,
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
