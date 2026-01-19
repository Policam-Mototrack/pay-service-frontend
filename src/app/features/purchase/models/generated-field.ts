import { FormControl } from '@angular/forms'
import { ProductTypeFieldType } from '../../../core/models/product-type.interface'

interface generatedFieldsDataItem {
  label: string
  value: string
}

export interface IGeneratedField {
  name: string
  title: string
  data?: generatedFieldsDataItem[]
  type: ProductTypeFieldType
  control: FormControl
}
