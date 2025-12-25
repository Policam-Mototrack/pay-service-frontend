import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { IProductApiInterface, IProductApiInterfaceById, IProductFilter } from "./models/prodcuts.api.interface";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class ProductsApiService {
  private http = inject(HttpClient);
  public getProducts(filter: IProductFilter = {}): Observable<IProductApiInterface> {
    return this.http.get<IProductApiInterface>(`${environment.apiUrl}/licenses/products`, { params: {
      ...filter
    } });
  }
  public getProductById(id: number): Observable<IProductApiInterfaceById> {
    return this.http.get<IProductApiInterfaceById>(`${environment.apiUrl}/licenses/products/${id}`);
  }
}