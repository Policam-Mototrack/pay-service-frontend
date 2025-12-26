import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PageContainerComponent } from '../../../../shared/components/layouts/page-container/page-container.component';
import { BackButtonComponent } from '../../../../shared/components/ui/back-button/back-button.component';
import { FormFieldComponent } from '../../../../shared/components/ui/form-field/form-field.component';
import { RadioGroupComponent, RadioOption } from '../../../../shared/components/ui/radio-group/radio-group.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-purchase-page',
  standalone: true,
  imports: [
    PageContainerComponent,
    BackButtonComponent,
    FormFieldComponent,
    RadioGroupComponent,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './purchase-page.component.html',
  styleUrl: './purchase-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurchasePageComponent {
  purchaseForm = new FormGroup({
    email: new FormControl(''),
    licenseType: new FormControl('single'),
    paymentMethod: new FormControl('creditCard'),
  });

  licenseTypeOptions = [
    { value: 'single', label: 'Single Project License' },
    { value: 'multiple', label: 'Multiple Project License' },
    { value: 'extended', label: 'Extended License' },
  ];

  paymentMethodOptions: RadioOption[] = [
    { value: 'creditCard', label: 'Credit Card' },
    { value: 'paypal', label: 'PayPal' },
  ];

  get emailControl(): FormControl {
    return this.purchaseForm.get('email') as FormControl;
  }

  get licenseTypeControl(): FormControl {
    return this.purchaseForm.get('licenseType') as FormControl;
  }

  get paymentMethodControl(): FormControl {
    return this.purchaseForm.get('paymentMethod') as FormControl;
  }

  onSubmit(): void {
    if (this.purchaseForm.valid) {
      console.log('Form submitted:', this.purchaseForm.value);
    }
  }
}
