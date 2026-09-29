import { Routes } from '@angular/router';
import { catalogRoutes } from './features/catalog/routes/catalog.routes';
import { purchaseRoutes } from './features/purchase/routes/purchase.routes';
import { sellerCabinetRoutes } from './features/seller-cabinet/routes/seller-cabinet.routes';
import { NotFoundPageComponent } from './shared/pages/not-found-page/not-found-page.component';

export const routes: Routes = [
    {
        path: 'catalog',
        children: catalogRoutes
    },
    {
        path: '',
        redirectTo: 'catalog',
        pathMatch: 'full'
    },
    {
        path: 'purchase',
        children: purchaseRoutes
    },
    {
        path: 'seller',
        children: sellerCabinetRoutes
    },
    {
        path: '**',
        component: NotFoundPageComponent
    }
];
