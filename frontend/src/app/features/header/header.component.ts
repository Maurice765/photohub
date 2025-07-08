import { Component } from "@angular/core";
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from "@angular/forms";
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';

@Component({
    selector: "app-header",
    imports: [
        CommonModule,
        FormsModule,
        MenubarModule,
        MenuModule,  
        InputGroupModule, 
        InputGroupAddonModule,
        InputTextModule,
        ButtonModule,
        AvatarModule, 
        SelectModule
    ],
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
    public value: string = '';
    public selectedCategory: string = 'all';
    public categories = [
        { name: 'All Categories', key: 'all' },
        { name: 'Nature', key: 'nature' },
        { name: 'Architecture', key: 'architecture' },
    ];
}