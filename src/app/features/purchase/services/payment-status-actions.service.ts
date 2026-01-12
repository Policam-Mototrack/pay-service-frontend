import { inject, Injectable, signal } from '@angular/core'
import { PaymentAction, ActionsIds } from '../models/payment-status'
import { Observable, of } from 'rxjs'
import { Inject } from '@angular/core'
import { LicensesGenerationApiService } from '../../../core/api/license-generation/license-generation-api.service'
@Injectable({
  providedIn: 'root',
})
export class PaymentStatusActionsService {
  private licensesGenerationApiService: LicensesGenerationApiService = inject(LicensesGenerationApiService)
  private licenseGeneration(uuid: string | undefined) {
    if (uuid) {
      return this.licensesGenerationApiService.generationLicensesFile(uuid).subscribe((res: any) => {
        const blob = res
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = 'Лицензия'
        console.log('скачать')
        a.click()

        URL.revokeObjectURL(url)
      })
    } else {
      return of(null)
    }
  }
  records: Record<ActionsIds, (payload: { uuid?: string }) => any> = {
    download: (payload) => {
      return this.licenseGeneration(payload.uuid)
    },
    reset_email: (payload) => {},
  }
}
