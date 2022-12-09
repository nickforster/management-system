import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import jwtDecode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  API_URL = 'http://localhost:3000';
  TOKEN_KEY = 'token';
  userID: number = -1
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
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

  getAllFoods() {
    this.readToken()
    return this.http.post(this.API_URL + '/getFoods', {userId: this.userID}, this.headers)
  }

  insertFood(name: string, price: number, categoryID: number, allergies: number[]) {
    this.readToken()
    this.http.post(this.API_URL + '/insertFood', {name, price, categoryID, allergies, userId: this.userID}, this.headers).subscribe();
  }

  updateFood(id: number, name: string, price: number, categoryID: number, allergies: number[]) {
    this.http.post(this.API_URL + '/updateFood', {id, name, price, categoryID, allergies}, this.headers).subscribe();
  }

  deleteFood(id: number) {
    this.http.post(this.API_URL + '/deleteFood', {id}, this.headers).subscribe();
  }
}
