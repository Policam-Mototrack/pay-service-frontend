import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { PageContainerComponent } from '../../../../shared/components/layouts/page-container/page-container.component'
import { ProductsApiService } from '../../../../core/api/products/products-api.service'
import { IProductApiInterface } from '../../../../core/api/products/models/prodcuts.api.interface'
import { CatalogStore } from '../../store/catalog.store'
import { IProductTypeApiInterface } from '../../../../core/api/product-types/models/product-types.api.interface'
import { ProductTypesApiService } from '../../../../core/api/product-types/product-types-api.service'
import { ProductCardComponent } from '../../components/product-card/product-card.component'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [PageContainerComponent, ProductCardComponent, CommonModule, RouterLink],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPageComponent implements OnInit {
  private productsApiService = inject(ProductsApiService)
  private productTypesApiService = inject(ProductTypesApiService)
  public catalogStore = inject(CatalogStore)

  getProducts() {
    if (this.catalogStore.products.length > 0) return
    this.productsApiService.getProducts().subscribe((response: IProductApiInterface) => {
      this.catalogStore.setProducts(response.data ?? [])
    })
  }

  getProductTypes() {
    if (this.catalogStore.productTypes.length > 0) return
    this.productTypesApiService.getProductTypes().subscribe((response: IProductTypeApiInterface) => {
      this.catalogStore.setProductTypes(response.data ?? [])
    })
  }

  ngOnInit() {
    this.getProducts()
    this.getProductTypes()
  }
}
