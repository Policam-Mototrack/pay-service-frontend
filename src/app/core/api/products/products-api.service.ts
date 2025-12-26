import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { DTOProduct, IProductApiInterface, IProductApiInterfaceById, IProductFilter } from './models/produсts.api.interface'
import { map, Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'
import { IProduct } from '../../../features/catalog/models/product-interface'

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  private http = inject(HttpClient)
  public getProducts(filter: IProductFilter = {}): Observable<IProduct[]> {
    return this.http.get<IProductApiInterface>(`${environment.apiUrl}/licenses/products`, {
      params: {
        ...filter,
      },
    })
    .pipe(
      map((response: IProductApiInterface) => response.data?.map(DTOProduct) ?? [])
    )
  }
  public getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProductApiInterfaceById>(`${environment.apiUrl}/licenses/products/${id}`).pipe(
      map((response: IProductApiInterfaceById) => DTOProduct(response.data ?? null))
    )
  }
}
