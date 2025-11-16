import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./shared/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      }
    ]
  },
  {
    path: 'police',
    loadComponent: () => import('./shared/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['POLICE'] },
    children: [
      {
        path: '',
        loadChildren: () => import('./features/police/police.routes').then(m => m.POLICE_ROUTES)
      }
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./shared/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      {
        path: '',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
      }
    ]
  },
  {
    path: 'bank',
    loadComponent: () => import('./shared/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['BANK'] },
    children: [
      {
        path: '',
        loadChildren: () => import('./features/bank/bank.routes').then(m => m.BANK_ROUTES)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];