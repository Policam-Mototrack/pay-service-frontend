import { Routes } from '@angular/router';
import { catalogRoutes } from './features/catalog/routes/catalog.routes';
export const routes: Routes = [
    {
        path: 'catalog',
        children: catalogRoutes
    },
    {
        path: '',
        redirectTo: 'catalog',
        pathMatch: 'full'
    }
];
