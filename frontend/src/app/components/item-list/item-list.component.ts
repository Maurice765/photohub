import { Component, OnInit } from '@angular/core';
import { ItemService, Item } from '../../services/item.service';

@Component({
  selector: 'app-item-list',
  templateUrl: 'item-list.component.html',
  styleUrl: 'item-list.component.scss'
})
export class ItemListComponent implements OnInit {
  items: Item[] = [];

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.getItems().subscribe(data => {
      this.items = data;
    });
  }
}
