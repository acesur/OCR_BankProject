import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';

import { AuthService } from '../../core/services/auth.service';
import { User, UserRole } from '../../core/models/user.model';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: UserRole[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatListModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  sidenavOpened = true;
  notifications = 3; // Mock notification count
  
  private destroy$ = new Subject<void>();

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', roles: [UserRole.POLICE, UserRole.ADMIN, UserRole.BANK] },
    
    // Police specific routes
    { label: 'New Report', icon: 'add_circle_outline', route: '/police/new-report', roles: [UserRole.POLICE] },
    { label: 'My Reports', icon: 'description', route: '/police/reports', roles: [UserRole.POLICE] },
    
    // Admin specific routes
    { label: 'All Reports', icon: 'assignment', route: '/admin/reports', roles: [UserRole.ADMIN] },
    { label: 'High Risk Accounts', icon: 'warning', route: '/admin/high-risk', roles: [UserRole.ADMIN] },
    { label: 'Banks Management', icon: 'account_balance', route: '/admin/banks', roles: [UserRole.ADMIN] },
    { label: 'Users Management', icon: 'people', route: '/admin/users', roles: [UserRole.ADMIN] },
    
    // Bank specific routes
    { label: 'Freeze Requests', icon: 'lock', route: '/bank/freeze-requests', roles: [UserRole.BANK] },
    { label: 'Account History', icon: 'history', route: '/bank/history', roles: [UserRole.BANK] },
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFilteredNavItems(): NavItem[] {
    if (!this.currentUser) return [];
    
    return this.navItems.filter(item => 
      item.roles.includes(this.currentUser!.role)
    );
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getRoleDisplayName(): string {
    if (!this.currentUser) return '';
    
    switch (this.currentUser.role) {
      case UserRole.POLICE:
        return 'Police Officer';
      case UserRole.ADMIN:
        return 'Admin';
      case UserRole.BANK:
        return 'Bank Officer';
      default:
        return this.currentUser.role;
    }
  }

  getDepartmentOrStation(): string {
    if (!this.currentUser) return '';
    
    if (this.currentUser.role === UserRole.POLICE && this.currentUser.station) {
      return this.currentUser.station;
    } else if (this.currentUser.role === UserRole.BANK && this.currentUser.bank) {
      return this.currentUser.bank;
    } else if (this.currentUser.department) {
      return this.currentUser.department;
    }
    
    return '';
  }

  getInitials(): string {
    if (!this.currentUser) return '';
    
    const names = this.currentUser.name.split(' ');
    return names.map(name => name.charAt(0)).join('').toUpperCase();
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}