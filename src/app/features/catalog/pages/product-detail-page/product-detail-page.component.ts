import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core'
import { map, Observable } from 'rxjs'
import { IProduct } from '../../models/product-interface'
import { IProductApiInterfaceById } from '../../../../core/api/products/models/produсts.api.interface'
import { CatalogStore } from '../../store/catalog.store'
import { ProductsApiService } from '../../../../core/api/products/products-api.service'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { PageContainerComponent } from '../../../../shared/components/layouts/page-container/page-container.component'
import { DTOProduct } from '../../../../core/api/products/models/produсts.api.interface'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [PageContainerComponent, RouterLink],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailPageComponent {
  private productId?: number
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private catalogStore = inject(CatalogStore)
  private productsApiService = inject(ProductsApiService)
  public product = signal<IProduct | undefined>(undefined)
  private destroyRef = inject(DestroyRef)
  getProductFromStore(id: number): IProduct | undefined {
    return this.catalogStore.products.find((product) => product.id == id)
  }
  getProductFromApi(id: number): Observable<IProduct> {
    return this.productsApiService.getProductById(id)
  }
  getProduct(id: number) {
    const productFromStore = this.getProductFromStore(id)
    if (productFromStore) {
      this.product.set(productFromStore)
      return
    }
    this.getProductFromApi(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((product: IProduct | null) => {
      this.product.set(product ?? undefined)
    })
  }
  ngOnInit() {
    this.productId = this.route.snapshot.params['id']
    if (this.productId) {
      this.getProduct(this.productId)
    }
    if (!this.productId) {
      this.router.navigate(['/catalog'])
    }
  }
}
