import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../core/services/auth.service';
import { FraudReportService } from '../../core/services/fraud-report.service';
import { User, UserRole } from '../../core/models/user.model';
import { FraudReport } from '../../core/models/fraud-report.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  statistics: any = {};
  recentReports: FraudReport[] = [];
  isLoading = true;

  private destroy$ = new Subject<void>();

  displayedColumns = ['reportNumber', 'accountNumber', 'bankName', 'riskLevel', 'status', 'actions'];

  constructor(
    private authService: AuthService,
    private fraudReportService: FraudReportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.loadDashboardData();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    // Load statistics based on user role
    if (this.currentUser?.role === UserRole.POLICE) {
      // For police, show their own reports
      this.fraudReportService.getReportsByUser(this.currentUser.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(reports => {
          this.processPoliceStats(reports);
          this.recentReports = reports.slice(-5).reverse();
          this.isLoading = false;
        });
    } else {
      // For admin and bank, show overall statistics
      this.fraudReportService.getReportStatistics()
        .pipe(takeUntil(this.destroy$))
        .subscribe(stats => {
          this.statistics = stats;
          this.recentReports = stats.recentReports;
          this.isLoading = false;
        });
    }
  }

  private processPoliceStats(reports: FraudReport[]): void {
    this.statistics = {
      totalReports: reports.length,
      pendingReports: reports.filter(r => r.status === 'pending').length,
      approvedReports: reports.filter(r => r.status === 'approved').length,
      rejectedReports: reports.filter(r => r.status === 'rejected').length,
      highRiskReports: reports.filter(r => r.riskLevel === 'high').length
    };
  }

  getDashboardTitle(): string {
    if (!this.currentUser) return 'Dashboard';
    
    switch (this.currentUser.role) {
      case UserRole.POLICE:
        return 'Police Dashboard';
      case UserRole.ADMIN:
        return 'Admin Dashboard';
      case UserRole.BANK:
        return 'Bank Dashboard';
      default:
        return 'Dashboard';
    }
  }

  getDashboardDescription(): string {
    if (!this.currentUser) return '';
    
    switch (this.currentUser.role) {
      case UserRole.POLICE:
        return 'Monitor your fraud reports and case status';
      case UserRole.ADMIN:
        return 'Central monitoring and case management';
      case UserRole.BANK:
        return `Manage account freeze requests - ${this.currentUser.bank}`;
      default:
        return 'System overview and monitoring';
    }
  }

  getStatCards(): any[] {
    if (!this.statistics) return [];

    if (this.currentUser?.role === UserRole.POLICE) {
      return [
        {
          title: 'Total Reports Filed',
          value: this.statistics.totalReports || 0,
          icon: 'description',
          color: 'primary',
          change: '+2 this week'
        },
        {
          title: 'Pending Reports',
          value: this.statistics.pendingReports || 0,
          icon: 'pending',
          color: 'warn',
          change: ''
        },
        {
          title: 'Approved Reports',
          value: this.statistics.approvedReports || 0,
          icon: 'check_circle',
          color: 'accent',
          change: ''
        },
        {
          title: 'High Risk Cases',
          value: this.statistics.highRiskReports || 0,
          icon: 'warning',
          color: 'warn',
          change: ''
        }
      ];
    } else if (this.currentUser?.role === UserRole.ADMIN) {
      return [
        {
          title: 'Total Reports',
          value: this.statistics.totalReports || 0,
          icon: 'assignment',
          color: 'primary',
          change: '+12% from last week'
        },
        {
          title: 'High Risk Reports',
          value: this.statistics.highRiskReports || 0,
          icon: 'error',
          color: 'warn',
          change: '-5% from last week'
        },
        {
          title: 'Approved for Freeze',
          value: this.statistics.approvedReports || 0,
          icon: 'lock',
          color: 'accent',
          change: ''
        },
        {
          title: 'Total Frozen Accounts',
          value: this.statistics.frozenAccounts || 0,
          icon: 'security',
          color: 'primary',
          change: ''
        }
      ];
    } else if (this.currentUser?.role === UserRole.BANK) {
      return [
        {
          title: 'Freeze Requests Pending',
          value: 3,
          icon: 'pending',
          color: 'warn',
          change: ''
        },
        {
          title: 'Freeze Completed',
          value: 12,
          icon: 'check_circle',
          color: 'accent',
          change: ''
        },
        {
          title: 'Requests Failed',
          value: 1,
          icon: 'error',
          color: 'warn',
          change: ''
        },
        {
          title: 'Total Amount Frozen',
          value: '₹2.5M',
          icon: 'account_balance',
          color: 'primary',
          change: ''
        }
      ];
    }

    return [];
  }

  navigateToReports(): void {
    if (this.currentUser?.role === UserRole.POLICE) {
      this.router.navigate(['/police/reports']);
    } else if (this.currentUser?.role === UserRole.ADMIN) {
      this.router.navigate(['/admin/reports']);
    } else if (this.currentUser?.role === UserRole.BANK) {
      this.router.navigate(['/bank/freeze-requests']);
    }
  }

  navigateToNewReport(): void {
    if (this.currentUser?.role === UserRole.POLICE) {
      this.router.navigate(['/police/new-report']);
    }
  }

  canCreateReport(): boolean {
    return this.currentUser?.role === UserRole.POLICE;
  }

  getRiskBadgeClass(riskLevel: string): string {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'risk-badge-high';
      case 'medium': return 'risk-badge-medium';
      case 'low': return 'risk-badge-low';
      default: return 'risk-badge-low';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-badge-pending';
      case 'under-review': return 'status-badge-review';
      case 'approved': return 'status-badge-approved';
      case 'rejected': return 'status-badge-rejected';
      case 'frozen': return 'status-badge-frozen';
      default: return 'status-badge-pending';
    }
  }
}