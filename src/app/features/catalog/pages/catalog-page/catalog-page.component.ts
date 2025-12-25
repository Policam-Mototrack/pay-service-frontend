import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { PageContainerComponent } from '../../../../shared/components/layouts/page-container/page-container.component'
import { ProductsApiService } from '../../../../core/api/products/products-api.service'
import { IProductApiInterface } from '../../../../core/api/products/models/prodcuts.api.interface'
import { CatalogStore } from '../../store/catalog.stroe'
import { IProductTypeApiInterface } from '../../../../core/api/product-types/models/product-types.api.interface'
import { ProductTypesApiService } from '../../../../core/api/product-types/product-types-api.service'
import { ProductCardComponent } from '../../components/product-card/product-card.component'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [PageContainerComponent, ProductCardComponent, CommonModule],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPageComponent implements OnInit {
  private productsApiService = inject(ProductsApiService)
  private productTypesApiService = inject(ProductTypesApiService)
  public catalogStore = new CatalogStore()

  getProducts() {
    this.productsApiService.getProducts().subscribe((response: IProductApiInterface) => {
      this.catalogStore.setProducts(response.data ?? [])
    })
  }

  getProductTypes() {
    this.productTypesApiService.getProductTypes().subscribe((response: IProductTypeApiInterface) => {
      this.catalogStore.setProductTypes(response.data ?? [])
    })
  }

  ngOnInit() {
    this.getProducts()
    this.getProductTypes()
  }
}
