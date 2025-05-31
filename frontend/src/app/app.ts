import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ItemListComponent} from './components/item-list/item-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ItemListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'frontend';
}
