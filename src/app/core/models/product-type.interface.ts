export type ProductTypeFieldType = 'string' | 'number' | 'boolean' | 'date' | 'select'|'textarea'
export interface IProductTypeField {
  title: string
  type: ProductTypeFieldType
}
export interface IProductType {
  id: number
  name: string
  fields: IProductTypeField[]
}
