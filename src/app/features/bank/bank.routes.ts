import { Routes } from '@angular/router';

export const BANK_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('../dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'freeze-requests',
    loadComponent: () => import('./freeze-requests/freeze-requests.component').then(m => m.FreezeRequestsComponent)
  },
  {
    path: 'freeze-requests/:id',
    loadComponent: () => import('./freeze-request-detail/freeze-request-detail.component').then(m => m.FreezeRequestDetailComponent)
  },
  {
    path: 'history',
    loadComponent: () => import('./account-history/account-history.component').then(m => m.AccountHistoryComponent)
  }
];