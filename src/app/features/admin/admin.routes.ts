import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
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
    path: 'reports',
    loadComponent: () => import('./reports-management/reports-management.component').then(m => m.ReportsManagementComponent)
  },
  {
    path: 'reports/:id',
    loadComponent: () => import('./report-review/report-review.component').then(m => m.ReportReviewComponent)
  },
  {
    path: 'high-risk',
    loadComponent: () => import('./high-risk-accounts/high-risk-accounts.component').then(m => m.HighRiskAccountsComponent)
  },
  {
    path: 'banks',
    loadComponent: () => import('./banks-management/banks-management.component').then(m => m.BanksManagementComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./users-management/users-management.component').then(m => m.UsersManagementComponent)
  }
];