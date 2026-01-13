import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '../../../../environments/environment'
import { of } from 'rxjs'
@Injectable({
  providedIn: 'root',
})
export class LicensesGenerationApiService {
  private http = inject(HttpClient)
  generationLicensesFile(uuid: string) {
    return this.http.post(`${environment.apiUrl}/licenses/licenses/download/${uuid}`, {}, { responseType: 'blob' })
  }
  sendLicensesFile(uuid: string) {
    return this.http.post(`${environment.apiUrl}/licenses/licenses/send/${uuid}`, {})
  }

}
