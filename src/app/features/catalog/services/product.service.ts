import { inject, Injectable } from '@angular/core'
import { IProduct } from '../models/product-interface'
import { CatalogStore } from '../store/catalog.store'
import { ProductsApiService } from '../../../core/api/products/products-api.service'
import { Observable, of } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private catalogStore = inject(CatalogStore)
  private productsApiService = inject(ProductsApiService)
  getProductFromStore(id: number): IProduct | undefined {
    return this.catalogStore.products.find((product) => product.id == id)
  }
  getProductFromApi(id: number): Observable<IProduct> {
    return this.productsApiService.getProductById(id)
  }
  getProduct(id: number): Observable<IProduct> {
    const productFromStore = this.getProductFromStore(id)
    if (productFromStore) {
      return of(productFromStore)
    }
    return this.getProductFromApi(id)
  }
}
