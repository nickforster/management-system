import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
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

  getAllCategories() {
    this.readToken()
    return this.http.post(this.API_URL + '/getCategories', {userId: this.userID}, this.headers)
  }

  insertCategory(name: string) {
    this.readToken()
    this.http.post(this.API_URL + '/insertCategory', {name, userId: this.userID}, this.headers).subscribe();
  }

  updateCategory(id: number, name: string) {
    this.http.post(this.API_URL + '/updateCategory', {id, name}, this.headers).subscribe();
  }

  deleteCategory(id: number) {
    this.http.post(this.API_URL + '/deleteCategory', {id}, this.headers).subscribe();
  }
}
