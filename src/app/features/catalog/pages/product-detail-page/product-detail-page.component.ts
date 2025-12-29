import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core'
import { EMPTY, catchError, map, Observable } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { IProduct } from '../../../../core/models/product.interface'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { PageContainerComponent } from '../../../../shared/components/layouts/page-container/page-container.component'
import { BackButtonComponent } from '../../../../shared/components/ui/back-button/back-button.component'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ProductService } from '../../services/product.service'
import { getErrorMessage } from '../../../../shared/utils/error-message.util'
import { ToastService } from '../../../../core/services/toast.service'
import { Title } from '@angular/platform-browser'
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
  private toastService = inject(ToastService)
  private title = inject(Title)

  ngOnInit() {
    this.productId = this.route.snapshot.params['id']
    if (this.productId) {
      this.productService
        .getProduct(this.productId)
        .pipe(takeUntilDestroyed(this.destroyRef),catchError((error: HttpErrorResponse) => {
          this.toastService.error(getErrorMessage(error))
          this.router.navigate(['/catalog']);
          return EMPTY
        }),
        )
        .subscribe((product: IProduct) => {
          if (product) {
            this.product.set(product)
            this.title.setTitle(product.name)
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
