import { Routes } from "@angular/router";
import { CatalogPageComponent } from "../pages/catalog-page/catalog-page.component";
import { ProductDetailPageComponent } from "../pages/product-detail-page/product-detail-page.component";
export const catalogRoutes: Routes = [
    {
        path: '',
        component: CatalogPageComponent
    },
    {
        path: ':id',
        component: ProductDetailPageComponent
    }
]   