import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { AnonymousAuthApiInterface } from './models/anonymous-auth.api.interface'
import { Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class AnonymousAuthApiService {
  private http = inject(HttpClient)

  public createAnonymousAuth(): Observable<AnonymousAuthApiInterface> {
    return this.http.post<AnonymousAuthApiInterface>(`${environment.apiUrl}/licenses/visitors`, {})
  }
}
