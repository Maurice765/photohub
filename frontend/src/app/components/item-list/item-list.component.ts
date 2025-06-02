import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { Item } from '../../core/modules/openapi';

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
