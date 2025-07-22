import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@features/header/header.component';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        HeaderComponent,
        Toast
    ],
    template: `
        <header></header>
        <router-outlet></router-outlet>
        <p-toast></p-toast>
    `,
    providers: [ MessageService ]
})
export class AppComponent {
    title = 'PhotoHub';
}