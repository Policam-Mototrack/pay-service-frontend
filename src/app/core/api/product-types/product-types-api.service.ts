import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { IProductTypeApiInterface, IProductTypeApiInterfaceById } from "./models/product-types.api.interface";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ProductTypesApiService {
    private http = inject(HttpClient);
    public getProductTypes(): Observable<IProductTypeApiInterface> {
        return this.http.get<IProductTypeApiInterface>(`${environment.apiUrl}/licenses/product-types`);
    }
    public getProductTypeById(id: number): Observable<IProductTypeApiInterfaceById> {
        return this.http.get<IProductTypeApiInterfaceById>(`${environment.apiUrl}/licenses/product-types/${id}`);
    }
}   