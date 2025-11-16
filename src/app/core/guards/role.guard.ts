import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const requiredRoles: UserRole[] = route.data['roles'];
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    return this.authService.currentUser$.pipe(
      map(user => {
        if (user && this.authService.hasAnyRole(requiredRoles)) {
          return true;
        } else {
          // Redirect based on user role or to dashboard
          this.redirectBasedOnRole();
          return false;
        }
      })
    );
  }

  private redirectBasedOnRole(): void {
    const user = this.authService.getCurrentUser();
    
    if (user) {
      switch (user.role) {
        case UserRole.POLICE:
          this.router.navigate(['/police']);
          break;
        case UserRole.ADMIN:
          this.router.navigate(['/admin']);
          break;
        case UserRole.BANK:
          this.router.navigate(['/bank']);
          break;
        default:
          this.router.navigate(['/dashboard']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}