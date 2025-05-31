import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Item {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:8000/api/items/';

  constructor(private http: HttpClient) {}

  getItems(): Observable<Item[]> {
    console.log(this.http.get<Item[]>(this.apiUrl))
    return this.http.get<Item[]>(this.apiUrl);
  }
}
