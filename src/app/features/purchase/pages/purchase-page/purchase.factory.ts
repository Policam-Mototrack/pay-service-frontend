import { IProduct } from '../../../../core/models/product.interface'
import { FormControl, Validators } from '@angular/forms'
import { normalizeProductTypeFields } from '../../../../core/models/product-type.interface'
import { IGeneratedField } from '../../models/generated-field'

export class PurchaseFactory {
  static createPurchaseForm(product: IProduct) {
    const generatedFields: IGeneratedField[] = []
    normalizeProductTypeFields(product.productType?.fields).forEach((field) => {
      generatedFields.push({
        name: field.title,
        title: field.title,
        type: field.type,
        data: field.data,
        control: new FormControl('', [Validators.required]),
      })
    })
    //Моковые данные
    // generatedFields.push({
    //   name: 'Тестовый список',
    //   title: 'Тестовый список',
    //   type: 'select',
    //   data: [
    //     { value: '1', label: 'Первый' },
    //     { value: '2', label: 'Второй' },
    //   ],
    //   control: new FormControl('', [Validators.required]),
    // })
    // generatedFields.push({
    //   name: 'Тестовый чекбокс',
    //   title: 'Тестовый чекбокс',
    //   type: 'boolean',
    //   control: new FormControl('', [Validators.required]),
    // })
    // generatedFields.push({
    //   name: 'Тестовый текст',
    //   title: 'Тестовый текст',
    //   type: 'textarea',
    //   control: new FormControl('', [Validators.required]),
    // })
    return generatedFields
  }
}
