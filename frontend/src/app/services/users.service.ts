import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'http://localhost:8080/auth';

  private readonly isLoggedIn = new BehaviorSubject<boolean>(false);

  private readonly currentUsername = new BehaviorSubject<string | null>(null);
  private readonly currentUserId = new BehaviorSubject<number | null>(null);

  private tokenExpired = new BehaviorSubject<boolean>(false);


  constructor(private http: HttpClient, private cookieService: CookieService) {

    const authToken = this.cookieService.get('authToken');
    if (authToken) {
      this.isLoggedIn.next(true);
      this.setCurrentUsernameFromToken(authToken);
    }

  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response: any) => {
        if (response.token) {

          this.cookieService.set('authToken', response.token, { expires: 1 / 24 });
          this.setCurrentUsernameFromToken(response.token);

          this.isLoggedIn.next(true);
        }
      })
    );
  }


  signup(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }


  logout(): void {
    this.cookieService.delete('authToken');
    this.cookieService.delete('currentUsername');
    this.isLoggedIn.next(false);
    this.currentUsername.next(null);
  }


  isAuthenticatedWithCookie(): Observable<boolean> {
    return this.isLoggedIn.asObservable();
  }


  getCurrentUsername(): Observable<string | null> {
    return this.currentUsername.asObservable();
  }


  private setCurrentUsernameFromToken(token: string): void {
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      if (payload && payload.sub) {
        this.currentUsername.next(payload.sub);
        this.currentUserId.next(payload.id);
      }
    }
  }


  getToken(): string {
    return this.cookieService.get('authToken');
  }

  getCurrentUserId(): Observable<number | null> {
    return this.currentUserId.asObservable();
  }


  checkTokenExpiration(): void {
    const authToken = this.getToken();
    if (authToken) {
      const tokenParts = authToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const expirationTime = payload.exp * 1000; 
        const currentTime = Date.now();

        if (expirationTime <= currentTime) {
          this.tokenExpired.next(true);
          this.logout(); 
        } else {
          this.tokenExpired.next(false);
        }
      }
    }
  }

    getTokenExpired(): Observable<boolean> {
      return this.tokenExpired.asObservable();
    }

}
