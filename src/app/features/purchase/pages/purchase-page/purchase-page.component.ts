import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { PageContainerComponent } from '../../../../shared/components/layouts/page-container/page-container.component'
import { BackButtonComponent } from '../../../../shared/components/ui/back-button/back-button.component'
import { FormFieldComponent } from '../../../../shared/components/ui/form-field/form-field.component'
import { RadioGroupComponent } from '../../../../shared/components/ui/radio-group/radio-group.component'
import { DatePickerComponent } from '../../../../shared/components/ui/date-picker/date-picker.component'
import { CommonModule, DatePipe } from '@angular/common'
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
import { catchError, concatMap, EMPTY } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { getErrorMessage } from '../../../../shared/utils/error-message.util'
import { AnonymousAuthService } from '../../../auth/anonymous-auth/services/anonymous-auth.service'
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
  providers: [DatePipe],
})
export class PurchasePageComponent {
  private productService = inject(ProductService)
  private destroyRef = inject(DestroyRef)
  private route = inject(ActivatedRoute)
  private purchasesApiService = inject(PurchasesApiService)
  private productId?: number
  private datePipe: DatePipe = inject(DatePipe)
  private anonymousAuthService = inject(AnonymousAuthService)
  public purchaseFields = signal<IGeneratedField[]>([])
  purchaseForm = new FormGroup({})
  bankApiService = inject(BankApiService)
  private toastService = inject(ToastService)
  private router = inject(Router)
  product = signal<IProduct | undefined>(undefined)
  serviceFee = signal<number>(0)
  private title = inject(Title)
  private buildPaymentReturnUrl(type: 'success' | 'fail', purchaseUuid: string): string {
    const tree = this.router.createUrlTree(['/purchase/payment-status', purchaseUuid], {
      queryParams: { paymentResult: type },
    })
    return new URL(this.router.serializeUrl(tree), window.location.origin).toString()
  }
  goBackToProduct(): void {
    this.router.navigate(['/catalog', this.productId])
  }
  submitForm(): void {
    this.createPurchase()
  }

  formatDateInFields(formValue: any) {
    let fields = this.purchaseFields().filter((field: IGeneratedField) => field.type == 'date')
    fields.forEach((field) => formValue[field.name] = this.datePipe.transform(formValue[field.name], 'dd.MM.yyyy'))
  }
  createPurchase(): void {
    this.purchaseForm.markAllAsTouched()
    if (!this.purchaseForm.valid) {
      this.toastService.error('Заполните все обязательные поля')
      return
    }
    const visitorUuid = this.anonymousAuthService.uuid()
    if (!visitorUuid) {
      this.toastService.error('Вы не авторизованы')
      return
    }
    const formValue = { ...this.purchaseForm.value } as Record<string, unknown>
    this.formatDateInFields(formValue)
    delete formValue['personalDataConsent']
    delete formValue['insuranceConfirmation']
    delete formValue['sportsLicenseAgreement']

    const email = String(formValue['email'] ?? '')
    const phone = String(formValue['phone'] ?? '')
    delete formValue['email']
    delete formValue['phone']

    const createPurchase: ICreatePurchase = {
      visitor_uuid: visitorUuid,
      email,
      phone,
      products: [
        {
          product_id: this.productId!,
          fields: formValue as { [key: string]: string | number | boolean | Date },
        },
      ],
    }
    let purchaseUuidForRedirect = ''
    this.purchasesApiService
      .createPurchase(createPurchase)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          console.error('Error creating purchase:', error)
          this.toastService.error(getErrorMessage(error))
          return EMPTY
        }),
        concatMap((purchase: IPurchase) => {
          purchaseUuidForRedirect = purchase.uuid
          this.serviceFee.set(purchase.serviceFee)
          return this.bankApiService.initializePurchase({
            purchase_uuid: purchase.uuid,
            email,
            phone,
            success_url: this.buildPaymentReturnUrl('success', purchase.uuid),
            fail_url: this.buildPaymentReturnUrl('fail', purchase.uuid),
          })
        }),
        catchError((error: HttpErrorResponse) => {
          this.toastService.error(getErrorMessage(error))
          return EMPTY
        }),
      )
      .subscribe((_response: BaseServerResponse<IPaymentLink>) => {
        this.router.navigate(['/purchase/payment-status', purchaseUuidForRedirect])
        this.toastService.success('Платеж инициализирован')
      })
  }

  getFormControl(controlName: string): FormControl {
    return this.purchaseForm.get(controlName) as FormControl
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
    const product = this.product()
    if (!product) {
      return
    }
    try {
      this.purchaseFields.set(PurchaseFactory.createPurchaseForm(product))
      this.purchaseFields().forEach((field) => {
        this.purchaseForm.addControl(field.name, field.control)
      })
    } catch (error) {
      console.error('Error creating purchase form:', error)
      this.purchaseFields.set([])
      this.toastService.error('Не удалось загрузить поля товара')
    }
    this.addCommonPurchaseControls()
  }

  private addCommonPurchaseControls(): void {
    const pairs: [string, FormControl][] = [
      ['email', new FormControl('', [Validators.required, Validators.email])],
      ['phone', new FormControl('', [Validators.required])],
      ['personalDataConsent', new FormControl(false, [Validators.requiredTrue])],
      ['insuranceConfirmation', new FormControl(false, [Validators.requiredTrue])],
      ['sportsLicenseAgreement', new FormControl(false, [Validators.requiredTrue])],
    ]
    for (const [name, control] of pairs) {
      if (!this.purchaseForm.contains(name)) {
        this.purchaseForm.addControl(name, control)
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
