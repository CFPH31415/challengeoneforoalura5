import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, combineLatest, map } from 'rxjs';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private authService: UsersService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return combineLatest([
      this.authService.isAuthenticatedWithCookie(),
      this.authService.getTokenExpired() 
    ]).pipe(
      map(([isLoggedIn, isTokenExpired]) => {
        if (isLoggedIn && !isTokenExpired) {
          return true; 
        } else {
          if (isTokenExpired) {
            this.router.navigate(['/login'], {
              queryParams: { expired: 'true' } 
            });
          } else {
            this.router.navigate(['/login']);
          }
          return false;
        }
      })
    );
  }
}

