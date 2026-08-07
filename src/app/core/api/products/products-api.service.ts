import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { DTOProduct, IProductApiInterface, IProductApiInterfaceById, IProductFilter } from './models/produсts.api.interface'
import { map, Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'
import { IProduct } from '../../models/product.interface'

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  private http = inject(HttpClient)
  public getProducts(filter: IProductFilter = {}): Observable<IProduct[]> {
    return this.http
      .get<IProductApiInterface>(`${environment.apiUrl}/licenses/products`, {
        params: {
          'pagination[limit]': -1,
          'filter[is_visible]': true,
          ...filter,
        },
      })
      .pipe(map((response: IProductApiInterface) => response.data?.map(DTOProduct) ?? []))
  }
  public getProductById(id: number): Observable<IProduct> {
    return this.http
      .get<IProductApiInterfaceById>(`${environment.apiUrl}/licenses/products/${id}`)
      .pipe(map((response: IProductApiInterfaceById) => DTOProduct(response.data ?? null)))
  }
 
}
