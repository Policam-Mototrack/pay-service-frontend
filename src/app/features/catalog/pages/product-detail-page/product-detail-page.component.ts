import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core'
import { map, Observable } from 'rxjs'
import { IProduct } from '../../../../core/models/product-interface'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { PageContainerComponent } from '../../../../shared/components/layouts/page-container/page-container.component'
import { BackButtonComponent } from '../../../../shared/components/ui/back-button/back-button.component'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ProductService } from '../../services/product.service'
@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [PageContainerComponent, RouterLink, BackButtonComponent],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailPageComponent {
  private productId?: number
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  public product = signal<IProduct | undefined>(undefined)
  private destroyRef = inject(DestroyRef)
  private productService = inject(ProductService)

  ngOnInit() {
    this.productId = this.route.snapshot.params['id']
    if (this.productId) {
      this.productService
        .getProduct(this.productId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((product: IProduct) => {
          if (product) {
            this.product.set(product)
          } else {
            this.router.navigate(['/catalog'])
          }
        })
    }
    if (!this.productId) {
      this.router.navigate(['/catalog'])
    }
  }
}
