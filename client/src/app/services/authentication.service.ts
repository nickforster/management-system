import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  API_URL = 'http://localhost:3000';
  TOKEN_KEY = 'token';

  constructor(private http: HttpClient, private router: Router) { }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  login(username: string, password: string) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Authorization':'Bearer ' + localStorage.getItem(this.TOKEN_KEY)
      })
    };

    const data = {
      username: username,
      password: password
    };

    this.http.post(this.API_URL + '/login', data, headers).subscribe(
      (res: any) => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        this.router.navigateByUrl('/app');
      }
    );
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

    this.http.post(this.API_URL + '/register', data, headers).subscribe(
      (res: any) => {
        localStorage.setItem(this.TOKEN_KEY, res.token);

        this.router.navigateByUrl('/app');
      }
    );
  }
}
