import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'streak/:id',
    loadComponent: () => import('./component/streak/streak.component'),
  },
];
