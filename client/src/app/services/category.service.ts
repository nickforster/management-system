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

  insertCategory(name: string) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      })
    };

    this.http.post(this.API_URL + '/insertCategory', {name}, headers).subscribe();
  }

  updateCategory(id: number, name: string) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      })
    };

    this.http.post(this.API_URL + '/updateCategory', {id, name}, headers).subscribe();
  }

  deleteCategory(id: number) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      })
    };

    this.http.post(this.API_URL + '/deleteCategory', {id}, headers).subscribe();
  }
}
