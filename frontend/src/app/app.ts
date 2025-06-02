import { Component } from '@angular/core';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ApiModule } from './core/modules/openapi';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [ItemListComponent, ApiModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'frontend';
}
