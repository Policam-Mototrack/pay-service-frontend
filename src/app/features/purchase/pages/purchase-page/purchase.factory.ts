import { IProduct } from '../../../../core/models/product.interface'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { IGeneratedField } from '../../models/generated-field'

export class PurchaseFactory {
  static createPurchaseForm(product: IProduct) {
    const generatedFields: IGeneratedField[] = []
    product.productType.fields.forEach((field, index) => {
      generatedFields.push({
        name: field.title,
        title: field.title,
        type: field.type,
        control: new FormControl('', [Validators.required]),
      })
    })
    return generatedFields
  }
}
