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

/** API может вернуть массив полей или объект вида { "0": {...}, "1": {...} } */
export function normalizeProductTypeFields(fields: unknown): IProductField[] {
  if (Array.isArray(fields)) {
    return fields as IProductField[]
  }
  if (fields != null && typeof fields === 'object') {
    return Object.values(fields as Record<string, IProductField>)
  }
  return []
}
