import {Injectable} from '@angular/core';
import {catchError, map, Observable, throwError} from 'rxjs';
import {Store} from '@ngrx/store';
import {AuthState} from '../../store/auth/auth.state';
import {AuthResponse, RegisterResponse, UserCredentials} from '../interfaces/auth.interface';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly API_URL = environment.apiUrl;

  constructor(
    private store: Store<{ auth: AuthState }>,
    private http: HttpClient,
    private router: Router)
  {}

  // Selector para obtener el email
  selectUserEmail(): Observable<string | null> {
    return this.store.select(state => state.auth.user?.email || null);
  }

  // Selector para verificar si está autenticado
  selectIsAuthenticated(): Observable<boolean> {
    return this.store.select(state => !!state.auth.user);
  }

  // Selector para verificar si es admin
  selectIsAdmin(): Observable<boolean> {
    return this.store.select(state => !!state.auth.user?.isAdmin);
  }

  login(credentials: UserCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
      }),
      catchError(error => {
        // Puedes personalizar el mensaje aquí si es necesario
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  register(credentials: UserCredentials): Observable<RegisterResponse> {
    return this.http.post(`${this.API_URL}/auth/register`, credentials, { responseType: 'text' }).pipe(
      map((response: string) => {
        return { message: response } as RegisterResponse;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
