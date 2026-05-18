import { BaseServerResponse } from '../../shared/models/responses/base-server-response.interface'
import { DTOProductType, productTypeDTO } from '../../product-types/models/product-types.api.interface'
import { IAdditionalAgreement } from '../../../models/additional-agreement.interface'
import { IProduct } from '../../../models/product.interface'

export interface additionalAgreementDTO {
  id: number
  product_id: number
  name: string
  document_url: string
  created_at: string
  updated_at: string
}
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
  additional_agreements?: additionalAgreementDTO[],
  image_url?:string|null
}

const DTOAdditionalAgreement = (dto: additionalAgreementDTO): IAdditionalAgreement => ({
  id: dto.id,
  productId: dto.product_id,
  name: dto.name,
  documentUrl: dto.document_url,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
})
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
    additionalAgreements: productDTO?.additional_agreements?.map(DTOAdditionalAgreement) ?? [],
    isVisible:productDTO?.is_visible,
    imageUrl:productDTO?.image_url || null
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
