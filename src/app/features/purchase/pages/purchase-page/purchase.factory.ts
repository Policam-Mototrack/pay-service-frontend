import { IProduct } from "../../../catalog/models/product-interface";
import { FormBuilder, FormControl } from "@angular/forms";
import { IGeneratedField } from "../../models/generated-field";

export class PurchaseFactory {
    static createPurchaseForm(product: IProduct) {
        const generatedFields: IGeneratedField[] = []
        product.productType.fields.forEach((field, index) => {
            generatedFields.push({
                name: field.title,
                title: field.title,
                type: field.type,
                control: new FormControl('')
            })
        })
        return generatedFields
    }
    private static generateName(title: string, index: number): string {
        return (
          title
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^\w]/g, '')
          || `field_${index}`
        )
      }
}