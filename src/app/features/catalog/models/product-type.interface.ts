export interface IProductTypeField {
  title: string
  type: 'string' | 'number' | 'boolean' | 'date'
}
export interface IProductType {
  id: number
  name: string
  fields: IProductTypeField[]
}
