import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  API_URL = 'http://localhost:3000';
  TOKEN_KEY = 'token';

  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer ' + localStorage.getItem(this.TOKEN_KEY)
    })
  };

  constructor(private http: HttpClient) { }

  sendMail(mail: Mail) {
    return this.http.post(this.API_URL + '/sendMail', mail, this.headers)
  }
}

interface Mail {
  name: string;
  from: string;
  to: string;
  subject: string;
  message: string;
}

