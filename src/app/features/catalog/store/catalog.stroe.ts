import { Injectable, signal } from "@angular/core";
import { IProduct } from "../../../core/api/products/models/prodcuts.api.interface";
import { IProductType } from "../../../core/api/product-types/models/product-types.api.interface";
@Injectable()
export class CatalogStore {
    private _products = signal<IProduct[]>([]);
    private _productTypes = signal<IProductType[]>([]);
    get products() {
        return this._products();
    }
    get productTypes() {
        return this._productTypes();
    }
    setProducts(products: IProduct[]) {
        this._products.set(products);
    }
    setProductTypes(productTypes: IProductType[]) {
        this._productTypes.set(productTypes);
    }
}