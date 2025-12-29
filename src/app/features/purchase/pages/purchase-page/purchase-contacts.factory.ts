import { FormControl, FormGroup, Validators } from '@angular/forms'

export class PurchaseContactsFactory {
  static createPurchaseContactsForm(purchaseUuid?: string | null): FormGroup {
    return new FormGroup({
      purchaseUuid: new FormControl(purchaseUuid ?? null, [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
    })
  }
}
