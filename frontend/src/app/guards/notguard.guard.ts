import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})

export class NotAuthGuard implements CanActivate {
  constructor(private authService: UsersService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticatedWithCookie().pipe(
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          return true; 
        } else {
          this.router.navigate(['/topics']); 
          return false;
        }
      })
    );
  }
}

