import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, signal } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { PageContainerComponent } from '../../../../shared/components/layouts/page-container/page-container.component'
import { BackButtonComponent } from '../../../../shared/components/ui/back-button/back-button.component'
import { FormFieldComponent } from '../../../../shared/components/ui/form-field/form-field.component'
import { RadioGroupComponent, RadioOption } from '../../../../shared/components/ui/radio-group/radio-group.component'
import { DatePickerComponent } from '../../../../shared/components/ui/date-picker/date-picker.component'
import { CommonModule } from '@angular/common'
import { ProductService } from '../../../catalog/services/product.service'
import { IProduct } from '../../../../core/models/product.interface'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Router } from '@angular/router'
import { PurchaseFactory } from './purchase.factory'
import { IGeneratedField } from '../../models/generated-field'
import { LocalizeFieldErrorPipe } from '../../../../shared/pipes/localize-field-error.pipe'
import { ToastService } from '../../../../core/services/toast.service'
import { IPurchase } from '../../../../core/models/purchase.interface'
import { PurchasesApiService } from '../../../../core/api/purchases/purchases-api.service'
import { ICreatePurchase } from '../../../../core/api/purchases/models/purchase.api.interface'
import { catchError, EMPTY, of } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { getErrorMessage } from '../../../../shared/utils/error-message.util'
import { AnonymousAuthService } from '../../../auth/anonymous-auth/services/anonymous-auth.service'
import { PurchaseContactsFactory } from './purchase-contacts.factory'
import { BaseServerResponse } from '../../../../core/api/shared/models/responses/base-server-response.interface'
import { IPaymentLink } from '../../../../core/api/purchases/models/bank.api.interface'
import { BankApiService } from '../../../../core/api/purchases/bank-api.service'
import { Title } from '@angular/platform-browser'

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
    LocalizeFieldErrorPipe,
  ],
  templateUrl: './purchase-page.component.html',
  styleUrl: './purchase-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchasePageComponent {
  private productService = inject(ProductService)
  private destroyRef = inject(DestroyRef)
  private route = inject(ActivatedRoute)
  private purchasesApiService = inject(PurchasesApiService)
  private productId?: number
  private anonymousAuthService = inject(AnonymousAuthService)
  public purchaseFields = signal<IGeneratedField[]>([])
  purchaseForm = new FormGroup({})
  bankApiService = inject(BankApiService)
  private toastService = inject(ToastService)
  private router = inject(Router)
  purchaseContactsForm: FormGroup | undefined
  _purchaseState = signal<'initial' | 'contacts'>('initial')
  fb = inject(FormBuilder)
  product = signal<IProduct | undefined>(undefined)
  serviceFee = signal<number>(0)
  createdPurchaseUuid: string | undefined
  private title = inject(Title)
  goBackToProduct(): void {
    if (this._purchaseState() === 'contacts') {
      this._purchaseState.set('initial')
    } else {
      this.router.navigate(['/catalog', this.productId])
    }
  }
  submitForm(): void {
    if (this._purchaseState() === 'initial') {
      this.createPurchase()
    } else {
      this.initializePurchaseContactsForm()
    }
  }
  createPurchase(): void {
    this.purchaseForm.markAllAsTouched()
    if (!this.purchaseForm.valid) {
      this.toastService.error('Заполните все обязательные поля')
      return
    }
    if (this.purchaseForm.valid) {
      const visitorUuid = this.anonymousAuthService.uuid()
      if (!visitorUuid) {
        this.toastService.error('Вы не авторизованы')
        return
      }
      // Исключаем чекбоксы из отправляемых данных
      const formValue = { ...this.purchaseForm.value }
      delete (formValue as any).personalDataConsent
      delete (formValue as any).insuranceConfirmation
      delete (formValue as any).sportsLicenseAgreement

      const createPurchase: ICreatePurchase = {
        visitor_uuid: visitorUuid!,
        products: [
          {
            product_id: this.productId!,
            fields: formValue,
          },
        ],
      }
      this.purchasesApiService
        .createPurchase(createPurchase)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error: HttpErrorResponse) => {
            console.error('Error creating purchase:', error)
            this.toastService.error(getErrorMessage(error))
            return EMPTY
          }),
        )
        .subscribe((purchase: IPurchase) => {
          this.purchaseContactsForm = PurchaseContactsFactory.createPurchaseContactsForm(purchase.uuid)
          this.createdPurchaseUuid = purchase.uuid
          this.serviceFee.set(purchase.serviceFee)
          this._purchaseState.set('contacts')
        })
    }
  }
  initializePurchaseContactsForm() {
    if (this.purchaseContactsForm && this.createdPurchaseUuid) {
      this.purchaseContactsForm.markAllAsTouched()
      if (!this.purchaseContactsForm.valid) {
        this.toastService.error('Заполните все обязательные поля')
        return
      }
      this.bankApiService
        .initializePurchase({
          purchase_uuid: this.createdPurchaseUuid,
          email: this.purchaseContactsForm.value.email,
          phone: this.purchaseContactsForm.value.phone,
        })
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error: HttpErrorResponse) => {
            this.toastService.error(getErrorMessage(error))
            return EMPTY
          }),
        )
        .subscribe((response: BaseServerResponse<IPaymentLink>) => {
          this.router.navigate(['/purchase/payment-status', this.createdPurchaseUuid])
          this.toastService.success('Платеж инициализирован')
        })
    } else {
      this.toastService.error('Ошибка при создании покупки')
    }
  }
  getCurrentControlInContactsForm(controlName: string) {
    return this.purchaseContactsForm?.get(controlName) as FormControl
  }

  getCheckboxControl(controlName: string): FormControl {
    return this.purchaseForm.get(controlName) as FormControl
  }

  getServiceFee(): number {
    return this.serviceFee()
  }

  getTotalPrice(): number {
    const productPrice = this.product()?.price || 0
    return productPrice + this.getServiceFee()
  }
  createPurchaseForm() {
    if (this.product()) {
      try {
        this.purchaseFields.set(PurchaseFactory.createPurchaseForm(this.product()!))
        this.purchaseFields().forEach((field) => {
          this.purchaseForm.addControl(field.name, field.control)
        })
        // Добавляем контролы для чекбоксов
        this.purchaseForm.addControl('personalDataConsent', new FormControl(false, [Validators.requiredTrue]))
        this.purchaseForm.addControl('insuranceConfirmation', new FormControl(false, [Validators.requiredTrue]))
        this.purchaseForm.addControl('sportsLicenseAgreement', new FormControl(false, [Validators.requiredTrue]))
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
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error: HttpErrorResponse) => {
            this.toastService.error(getErrorMessage(error))
            this.router.navigate(['/catalog'])
            return EMPTY
          }),
        )
        .subscribe((product: IProduct) => {
          if (product) {
            this.product.set(product)
            this.createPurchaseForm()
            this.title.setTitle(`${product.name} - Оформление покупки`)
          }
        })
    }
  }
}
