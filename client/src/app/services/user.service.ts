import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import jwtDecode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  API_URL = 'http://localhost:3000';
  TOKEN_KEY = 'token';
  userID: number = -1
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + localStorage.getItem(this.TOKEN_KEY)
    })
  };

  constructor(private http: HttpClient) {
  }

  readToken() {
    let token = localStorage.getItem(this.TOKEN_KEY)
    if (token != null) {
      let decoded = jwtDecode(token)
      // @ts-ignore
      this.userID = decoded.id
    }
  }

  getUser() {
    this.readToken()
    return this.http.post(this.API_URL + '/getUser', {id: this.userID}, this.headers)
  }

  updateUser(username: string, email: string, password: string) {
    this.readToken()
    this.http.post(this.API_URL + '/updateUser', {id: this.userID, username, email, password}, this.headers).subscribe();
  }
}
