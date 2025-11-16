import { Routes } from '@angular/router';

export const POLICE_ROUTES: Routes = [
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
    path: 'new-report',
    loadComponent: () => import('./new-report/new-report.component').then(m => m.NewReportComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports-list/reports-list.component').then(m => m.ReportsListComponent)
  },
  {
    path: 'reports/:id',
    loadComponent: () => import('./report-detail/report-detail.component').then(m => m.ReportDetailComponent)
  }
];