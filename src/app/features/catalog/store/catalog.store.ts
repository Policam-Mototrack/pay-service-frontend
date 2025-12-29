import { Injectable, signal } from '@angular/core'
import { IProduct } from '../../../core/models/product.interface'
import { IProductType } from '../../../core/models/product-type.interface'
@Injectable({
  providedIn: 'root',
})
export class CatalogStore {
  private _products = signal<IProduct[]>([])
  private _productTypes = signal<IProductType[]>([])
  get products() {
    return this._products()
  }
  get productTypes() {
    return this._productTypes()
  }
  setProducts(products: IProduct[]) {
    this._products.set(products)
  }
  setProductTypes(productTypes: IProductType[]) {
    this._productTypes.set(productTypes)
  }
}
