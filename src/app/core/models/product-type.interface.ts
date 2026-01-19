export type ProductTypeFieldType = 'string' | 'number' | 'boolean' | 'date' | 'select'|'textarea'
export interface IProductTypeField {
  title: string
  type: ProductTypeFieldType
  data?: any
}
export interface IProductType {
  id: number
  name: string
  fields: IProductTypeField[]
}
