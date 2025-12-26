import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { PageContainerComponent } from '../../../../shared/components/layouts/page-container/page-container.component'
import { BackButtonComponent } from '../../../../shared/components/ui/back-button/back-button.component'
import { FormFieldComponent } from '../../../../shared/components/ui/form-field/form-field.component'
import { RadioGroupComponent, RadioOption } from '../../../../shared/components/ui/radio-group/radio-group.component'
import { DatePickerComponent } from '../../../../shared/components/ui/date-picker/date-picker.component'
import { CommonModule } from '@angular/common'
import { ProductService } from '../../../catalog/services/product.service'
import { IProduct } from '../../../catalog/models/product-interface'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ActivatedRoute } from '@angular/router'
import { PurchaseFactory } from './purchase.factory'
import { IGeneratedField } from '../../models/generated-field'

@Component({
  selector: 'app-purchase-page',
  standalone: true,
  imports: [
    PageContainerComponent,
    BackButtonComponent,
    FormFieldComponent,
    CommonModule,
    ReactiveFormsModule,
    RadioGroupComponent,
    DatePickerComponent,
  ],
  templateUrl: './purchase-page.component.html',
  styleUrl: './purchase-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchasePageComponent {
  private productService = inject(ProductService)
  private destroyRef = inject(DestroyRef)
  private route = inject(ActivatedRoute)
  private productId?: number
  public purchaseFields = signal<IGeneratedField[]>([])
  purchaseForm = new FormGroup({})
  fb = inject(FormBuilder)
  product = signal<IProduct | undefined>(undefined)

  onSubmit(): void {
    if (this.purchaseForm.valid) {
      console.log('Form submitted:', this.purchaseForm.value)
    }
  }
  createPurchaseForm() {
    if (this.product()) {
      try {
        this.purchaseFields.set(PurchaseFactory.createPurchaseForm(this.product()!))
        this.purchaseFields().forEach((field) => {
          this.purchaseForm.addControl(field.name, field.control)
        })
      } catch (error) {
        console.error('Error creating purchase form:', error)
      }
    }
  }
  ngOnInit() {
    this.productId = this.route.snapshot.params['productId']
    if (this.productId) {
      this.productService
        .getProduct(this.productId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((product: IProduct) => {
          if (product) {
            this.product.set(product)
            this.createPurchaseForm()
          }
        })
    }
  }
}
