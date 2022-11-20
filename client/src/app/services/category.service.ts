import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  getAllCategories() {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      })
    };

    return this.http.get(this.API_URL + '/getCategories', headers)
  }
}
