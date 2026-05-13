import { IProductType, normalizeProductTypeFields } from '../../../models/product-type.interface'
import { BaseServerResponse } from '../../shared/models/responses/base-server-response.interface'

export interface productTypeDTO {
  id: number
  name: string
  /** Массив или объект — нормализуется в DTOProductType */
  fields: unknown
}

export interface IProductTypeApiInterface extends BaseServerResponse<productTypeDTO[]> {
  data: productTypeDTO[]
}
export interface IProductTypeApiInterfaceById extends BaseServerResponse<productTypeDTO> {
  data: productTypeDTO
}

export const DTOProductType = (productTypeDTO: productTypeDTO): IProductType => {
  return {
    id: productTypeDTO?.id,
    name: productTypeDTO?.name,
    fields: normalizeProductTypeFields(productTypeDTO?.fields),
  }
}
