import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  API_URL = 'http://localhost:3000';
  TOKEN_KEY = 'token';

  constructor(private http: HttpClient, private router: Router) {
  }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  login(username: string, password: string) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Authorization': 'Bearer ' + localStorage.getItem(this.TOKEN_KEY)
      })
    };

    const data = {
      username: username,
      password: password
    };

    return this.http.post(this.API_URL + '/login', data, headers)
  }

  logout() {
    this.router.navigateByUrl('/login').then(r => {
      localStorage.removeItem(this.TOKEN_KEY)
    });
  }

  register(username: string, email: string, password: string) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      })
    };

    const data = {
      username: username,
      email: email,
      password: password
    };

    return this.http.post(this.API_URL + '/register', data, headers)
  }

  authorise() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + localStorage.getItem(this.TOKEN_KEY)
    })
    this.http.get(this.API_URL + '/authorise', {headers}).subscribe(
      () => {
      }, () => {
        this.router.navigateByUrl('/login')
      }
    )
  }
}
