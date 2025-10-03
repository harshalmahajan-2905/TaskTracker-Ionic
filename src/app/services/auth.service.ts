import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, AuthResponse } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor(
    private storage: Storage,
    private http: HttpClient
  ) {
    this.init();
  }

  async init() {
    await this.storage.create();
    const token = await this.storage.get('authToken');
    const user = await this.storage.get('currentUser');
    if (token && user) {
      this.currentUser.next(user);
      this.isAuthenticated.next(true);
    }
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  getCurrentUser(): User | null {
    return this.currentUser.value;
  }

  async getAuthToken(): Promise<string | null> {
    return await this.storage.get('authToken');
  }

  async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const response = await this.http.post<any>(`${environment.apiUrl}/auth/signup`, {
        email,
        password,
        name
      }).toPromise();

      if (response.token) {
        // Create user object from response
        const user = {
          id: response.userId?.toString() || '1',
          email: email,
          password: '', // Don't store password
          name: name,
          createdAt: new Date().toISOString()
        };

        // Store token and user data
        await this.storage.set('authToken', response.token);
        await this.storage.set('currentUser', user);
        
        this.currentUser.next(user);
        this.isAuthenticated.next(true);
      }

      return {
        success: true,
        message: response.message || 'Account created successfully',
        user: this.currentUser.value || undefined
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.error?.error || error.message || 'Failed to create account'
      };
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.http.post<any>(`${environment.apiUrl}/auth/login`, {
        email,
        password
      }).toPromise();

      if (response.token) {
        // Create user object from response (backend doesn't return user data in login)
        const user = {
          id: response.userId?.toString() || '1',
          email: email,
          password: '', // Don't store password
          name: response.name || 'User',
          createdAt: new Date().toISOString()
        };

        // Store token and user data
        await this.storage.set('authToken', response.token);
        await this.storage.set('currentUser', user);
        
        this.currentUser.next(user);
        this.isAuthenticated.next(true);
      }

      return {
        success: true,
        message: response.message || 'Login successful',
        user: this.currentUser.value || undefined
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.error?.error || error.message || 'Login failed'
      };
    }
  }

  async logout(): Promise<void> {
    await this.storage.remove('authToken');
    await this.storage.remove('currentUser');
    this.currentUser.next(null);
    this.isAuthenticated.next(false);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.storage.get('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}