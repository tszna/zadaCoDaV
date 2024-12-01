import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError  } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface ErasmusIn {
  id: number;
  destination_name: string;
  departure_date: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  message: string;
  username: string;
  roles: string[];
}

export interface StatusResponse {
  username: string;
  isAuthenticated: boolean;
  roles: string[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SuccessResponse {
  message: string;
}

export interface ErrorResponse {
  error: string;
}

export type InfoResponse = SuccessResponse | ErrorResponse;

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private apiUrl = environment.api;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private usernameSubject = new BehaviorSubject<string | null>(null);
  public username$ = this.usernameSubject.asObservable();
  private userRoles: string[] = [];

  constructor(private http: HttpClient) 
  {
    const storedRoles = localStorage.getItem('userRoles');
    if (storedRoles) {
      this.userRoles = JSON.parse(storedRoles);
      this.isAuthenticatedSubject.next(true);
    }
  }

  getUserRoles(): string[] {
    return this.userRoles;
  }

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    const url = `${this.apiUrl}/api/login`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = JSON.stringify(credentials);

    return this.http.post<LoginResponse>(url, body, { headers, withCredentials: true }).pipe(
      tap((response: LoginResponse) => {
        this.isAuthenticatedSubject.next(true);
        this.usernameSubject.next(response.username);
        this.userRoles = response.roles;
        localStorage.setItem('userRoles', JSON.stringify(response.roles));
      })
    );
  }

  logout() {
    const url = `${this.apiUrl}/api/logout`;
    return this.http.get(url, { withCredentials: true }).pipe(
      tap(() => {
        this.isAuthenticatedSubject.next(false);
        this.usernameSubject.next(null);
        this.userRoles = [];
        localStorage.removeItem('userRoles');
      })
    );
  }
  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  checkAuthStatus(): Observable<StatusResponse | null> {
    const url = `${this.apiUrl}/api/auth-status`;
    return this.http.get<StatusResponse>(url, { withCredentials: true }).pipe(
      tap((response: StatusResponse) => {
        const isAuthenticated = response.isAuthenticated;
        this.isAuthenticatedSubject.next(isAuthenticated);
        this.usernameSubject.next(isAuthenticated ? response.username : null);
      }),
      catchError((error) => {
        if (error.status === 401) {
          this.isAuthenticatedSubject.next(false);
          this.usernameSubject.next(null);
          this.userRoles = [];
          localStorage.removeItem('userRoles');
        }
        return of(null);
      })
    );
  }

  getErasmusInList(): Observable<ErasmusIn[]> {
    const url = `${this.apiUrl}/api/erasmus-in/list`;
    return this.http.get<ErasmusIn[]>(url);
  }

  addErasmusIn(data: { departure_date: string; destination_name: string }): Observable<InfoResponse> {
    const url = `${this.apiUrl}/api/erasmus-in/add`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<InfoResponse>(url, data, { headers, withCredentials: true });
  }

  updateErasmusIn(data: { id: number; departure_date: string }): Observable<InfoResponse> {
    const url = `${this.apiUrl}/api/erasmus-in/update`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<InfoResponse>(url, data, { headers, withCredentials: true });
  }

  deleteErasmusIn(id: number): Observable<InfoResponse> {
    const url = `${this.apiUrl}/api/erasmus-in/delete`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = { id };

    return this.http.request<InfoResponse>('delete', url, {
      headers,
      body,
      withCredentials: true,
    });
  }
}
