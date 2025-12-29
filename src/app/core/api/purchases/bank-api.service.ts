import { Observable } from "rxjs"
import { environment } from "../../../../environments/environment"
import { HttpClient } from "@angular/common/http"
import { inject, Injectable } from "@angular/core"
import { IInitializePurchase, IPaymentLink } from "./models/bank.api.interface"
import { BaseServerResponse } from "../shared/models/responses/base-server-response.interface"

@Injectable({
    providedIn: 'root'
})
export class BankApiService {
    private http = inject(HttpClient)
    public initializePurchase(initializePurchase: IInitializePurchase): Observable<BaseServerResponse<IPaymentLink>> {
        return this.http.post<BaseServerResponse<IPaymentLink>>(`${environment.apiUrl}/tbank/payments/initiate`, initializePurchase)
    }
}