import { inject, Injectable, signal } from '@angular/core'
import { PaymentAction, ActionsIds } from '../models/payment-status'
import { catchError, EMPTY, Observable, of } from 'rxjs'
import { Inject } from '@angular/core'
import { PaymentStatusService } from './payment-status.service'
import { LicensesGenerationApiService } from '../../../core/api/license-generation/license-generation-api.service'
import { IProduct } from '../../../core/models/product.interface'
import { ToastService } from '../../../core/services/toast.service'
@Injectable({
  providedIn: 'root',
})
export class PaymentStatusActionsService {
  private licensesGenerationApiService: LicensesGenerationApiService = inject(LicensesGenerationApiService)
  private toastService = inject(ToastService)
  private licenseGeneration(uuid?: string, product?: IProduct) {
    if (uuid && product) {
      return this.licensesGenerationApiService.generationLicensesFile(uuid).subscribe((res: any) => {
        const blob = res
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = product.name || 'Лицензия'
        a.click()
        URL.revokeObjectURL(url)
      })
    } else {
      this.toastService.error('Ошибка при скачивании')
      return of(null)
    }
  }
  private resetEmail(uuid?: string) {
    if(uuid){
      return this.licensesGenerationApiService.sendLicensesFile(uuid).pipe(
        catchError((err)=>{
          this.toastService.error('Ошибка при отправке товаров')
          return EMPTY;
        })
      ).subscribe((res)=>{
        this.toastService.success('Товары отправлены')
      })
    }else{
      return of(null)
    }
  }
  records: Record<ActionsIds, (payload: { uuid?: string; product?: IProduct }) => any> = {
    download: (payload) => {
      return this.licenseGeneration(payload.uuid, payload.product)
    },
    resetEmail: (payload) => {
      this.resetEmail(payload.uuid)
    },
  }
}
