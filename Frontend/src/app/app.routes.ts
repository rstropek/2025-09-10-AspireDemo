import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'mqtt',
    loadComponent: () => import('./mqtt/mqtt').then((m) => m.Mqtt),
  },
];
