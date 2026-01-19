export type ProductTypeFieldType = 'string' | 'number' | 'boolean' | 'date' | 'select'|'textarea'
export interface IProductField {
  title: string
  type: ProductTypeFieldType
  data?: any
}
export interface IProductType {
  id: number
  name: string
  fields: IProductField[]
}
