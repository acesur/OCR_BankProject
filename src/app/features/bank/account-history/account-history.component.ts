import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1>Account History</h1>
      <p>Account history component - Coming Soon!</p>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      color: #1976d2;
      margin-bottom: 16px;
    }
  `]
})
export class AccountHistoryComponent {}