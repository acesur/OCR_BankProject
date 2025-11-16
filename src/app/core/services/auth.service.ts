import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, delay, map } from 'rxjs/operators';

import { User, UserRole, LoginRequest, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private tokenKey = 'fraud_detection_token';
  private userKey = 'fraud_detection_user';
  
  // Mock users for demonstration
  private mockUsers: User[] = [
    {
      id: 1,
      username: 'police1',
      name: 'Inspector Sharma',
      email: 'sharma@police.gov.in',
      role: UserRole.POLICE,
      department: 'Criminal Investigation',
      station: 'Central Police Station',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date()
    },
    {
      id: 2,
      username: 'admin1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@authority.gov.in',
      role: UserRole.ADMIN,
      department: 'Central Fraud Authority',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date()
    },
    {
      id: 3,
      username: 'bank1',
      name: 'Michael Chen',
      email: 'michael.chen@sbi.co.in',
      role: UserRole.BANK,
      bank: 'State Bank of India',
      department: 'Fraud Prevention',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date()
    }
  ];

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Mock authentication - replace with actual API call
    const user = this.mockUsers.find(
      u => u.username === credentials.username && 
           this.validatePassword(credentials.password)
    );

    if (user) {
      const response: LoginResponse = {
        user,
        token: this.generateMockToken(),
        expiresIn: 3600 // 1 hour
      };

      return of(response).pipe(
        delay(1000), // Simulate network delay
        tap(response => {
          this.setSession(response);
        })
      );
    } else {
      return throwError(() => new Error('Invalid credentials'));
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired (mock implementation)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  refreshToken(): Observable<LoginResponse> {
    // Mock token refresh - replace with actual API call
    const user = this.getCurrentUser();
    if (user) {
      const response: LoginResponse = {
        user,
        token: this.generateMockToken(),
        expiresIn: 3600
      };
      return of(response).pipe(
        tap(response => this.setSession(response))
      );
    }
    return throwError(() => new Error('No user to refresh token for'));
  }

  private setSession(response: LoginResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem(this.userKey);
    if (storedUser && this.isAuthenticated()) {
      try {
        const user: User = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.logout();
      }
    }
  }

  private validatePassword(password: string): boolean {
    // Mock password validation - replace with actual validation
    return password === 'pass123';
  }

  private generateMockToken(): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      sub: this.currentUserSubject.value?.id
    }));
    const signature = btoa('mock-signature');
    return `${header}.${payload}.${signature}`;
  }
}