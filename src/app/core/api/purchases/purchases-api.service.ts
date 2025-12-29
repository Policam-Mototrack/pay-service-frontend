import { HttpClient, HttpContext } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { IPurchase } from "../../models/purchase.interface";
import { DTOPurchase, ICreatePurchase, IPurchaseApiInterface, IPurchaseApiInterfaceById } from "./models/purchase.api.interface";
import { environment } from "../../../../environments/environment";
import { map, Observable } from "rxjs";
import { SKIP_LOADER } from "../../interceptors/loader-interceptor";

@Injectable({
    providedIn: 'root'
})
export class PurchasesApiService {
    private http = inject(HttpClient)
    public getPurchaseForId(uuid: string): Observable<IPurchase> {
        return this.http.get<IPurchaseApiInterfaceById>(`${environment.apiUrl}/licenses/purchases/${uuid}`).pipe(map((response: IPurchaseApiInterfaceById) => DTOPurchase(response.data)));
    }
    public getPurchases(): Observable<IPurchase[]> {
        return this.http.get<IPurchaseApiInterface>(`${environment.apiUrl}/licenses/purchases`).pipe(map((response: IPurchaseApiInterface) => response.data.map(DTOPurchase)));
    }
    public createPurchase(purchase: ICreatePurchase): Observable<IPurchase> {
        return this.http.post<IPurchaseApiInterfaceById>(`${environment.apiUrl}/licenses/purchases`, purchase).pipe(map((response: IPurchaseApiInterfaceById) => DTOPurchase(response.data)));
    }
    public getPurchaseByUuid(uuid: string): Observable<IPurchase> {
        return this.http.get<IPurchaseApiInterfaceById>(`${environment.apiUrl}/licenses/purchases/${uuid}`).pipe(map((response: IPurchaseApiInterfaceById) => DTOPurchase(response.data)));
    }
    public getPurchaseByUuidNoLoader(uuid: string): Observable<IPurchase> {
        const context = new HttpContext().set(SKIP_LOADER, true)

        return this.http.get<IPurchaseApiInterfaceById>(`${environment.apiUrl}/licenses/purchases/${uuid}`, { context }).pipe(map((response: IPurchaseApiInterfaceById) => DTOPurchase(response.data)));
    }
    
}