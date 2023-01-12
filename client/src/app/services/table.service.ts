import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import jwtDecode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class TableService {
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

  getAllTables() {
    this.readToken()
    return this.http.post(this.API_URL + '/getTables', {userId: this.userID}, this.headers)
  }

  insertTable(name: string, amountPeople: number) {
    this.readToken()
    this.http.post(this.API_URL + '/insertTable', {name, amountPeople, userId: this.userID}, this.headers).subscribe();
  }

  updateTable(id: number, name: string, amountPeople: number) {
    this.http.post(this.API_URL + '/updateTable', {id, name, amountPeople}, this.headers).subscribe();
  }

  deleteTable(id: number) {
    this.http.post(this.API_URL + '/deleteTable', {id}, this.headers).subscribe();
  }
}
