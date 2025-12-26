import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { map, Observable, of, take, tap } from 'rxjs';
import { IProduct, IProductApiInterfaceById } from '../../../../core/api/products/models/prodcuts.api.interface';
import { CatalogStore } from '../../store/catalog.store';
import { ProductsApiService } from '../../../../core/api/products/products-api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PageContainerComponent } from '../../../../shared/components/layouts/page-container/page-container.component';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [PageContainerComponent, RouterLink],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailPageComponent {
  private productId?:number
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private catalogStore = inject(CatalogStore)
  private productsApiService = inject(ProductsApiService)
  public product = signal<IProduct | undefined>(undefined)
  getProductFromStore(id: number): IProduct | undefined {
    return this.catalogStore.products
      .find(product => product.id == id)
  }
  getProductFromApi(id: number): Observable<IProduct> {
    return this.productsApiService.getProductById(id).pipe(
      map((response: IProductApiInterfaceById) => response.data ?? null)
    )
  }
  getProduct(id: number){
    const productFromStore = this.getProductFromStore(id)
    if (productFromStore) {
      this.product.set(productFromStore)
      return
    }
    this.getProductFromApi(id).subscribe((product: IProduct | null) => {
      this.product.set(product ?? undefined)
      console.log(this.product())
    })
  }
  ngOnInit(){
    this.productId = this.route.snapshot.params['id']
    if (this.productId) {
      this.getProduct(this.productId)
    }
    if (!this.productId) {
      this.router.navigate(['/catalog'])
    }
  }
}
