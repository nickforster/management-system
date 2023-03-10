import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import jwtDecode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
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

  getAllOrders() {
    this.readToken()
    return this.http.post(this.API_URL + '/getOrders', {userId: this.userID}, this.headers)
  }

  getActiveOrders() {
    this.readToken()
    return this.http.post(this.API_URL + '/getActiveOrders', {userId: this.userID}, this.headers)
  }

  getOrdersOfTable(tableId: number) {
    return this.http.post(this.API_URL + '/getTableOrders', {tableId: tableId}, this.headers)
  }

  insertOrder(tableId: number, complete: boolean) {
    this.http.post(this.API_URL + '/createOrder', {tableId, complete}, this.headers).subscribe();
  }

  completeOrder(id: number) {
    this.http.post(this.API_URL + '/completeOrder', {id}, this.headers).subscribe();
  }

  changeTableOfOrder(id: number, tableId: number) {
    this.http.post(this.API_URL + '/changeTableOfOrder', {id, tableId}, this.headers).subscribe();
  }

  deleteOrder(id: number) {
    this.http.post(this.API_URL + '/deleteOrder', {id}, this.headers).subscribe();
  }

  addFoodToOrder(orderId: number, foodId: number) {
    this.http.post(this.API_URL + '/addFoodToOrder', {orderId, foodId}, this.headers).subscribe();
  }

  deleteFoodFromOrder(id: number) {
    this.http.post(this.API_URL + '/deleteFoodFromOrder', {id}, this.headers).subscribe();
  }

}
