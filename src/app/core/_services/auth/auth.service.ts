import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

// const httpOptions = {
//   headers: new HttpHeaders({ 'Access-Control-Allow-Origin': 'https://cms-dle.netlify.app/' })
// }
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth/`;
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  loginClient(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl + 'mobile/client', credentials);
  }

  loginProfessional(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl + 'mobile/professional', credentials);
  }
  
  emailValidation(body : any) {
    return this.http.post<any>(this.apiUrl + 'mobile/verification', body);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.loggedIn.next(false);
  }

  forgotPasswordRequest(data: any) {
    return this.http.post<any>(this.apiUrl + 'forgotpass', data);
  }

  setLoggedIn(status: boolean): void {
    this.loggedIn.next(status);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('user');
  }
}
