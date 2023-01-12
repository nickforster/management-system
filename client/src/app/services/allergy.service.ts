import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AllergyService {
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

  getAllAllergies() {
    this.readToken()
    return this.http.post(this.API_URL + '/getAllergies', {userId: this.userID}, this.headers)
  }

  insertAllergy(name: string) {
    this.readToken()
    this.http.post(this.API_URL + '/insertAllergy', {name, userId: this.userID}, this.headers).subscribe();
  }

  updateAllergy(id: number, name: string) {
    this.http.post(this.API_URL + '/updateAllergy', {id, name}, this.headers).subscribe();
  }

  deleteAllergy(id: number) {
    this.http.post(this.API_URL + '/deleteAllergy', {id}, this.headers).subscribe();
  }
}
