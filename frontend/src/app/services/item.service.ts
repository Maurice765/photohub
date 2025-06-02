import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService, Item } from '../core/modules/openapi';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(private api: ApiService) {}

  getItems(): Observable<Item[]> {
    return this.api.apiItemsList()
  }
}
