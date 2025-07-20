import { Component, inject } from "@angular/core";
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
import { Router } from "@angular/router";

@Component({
    selector: "header",
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
    private _router: Router = inject(Router);

    public value: string = '';
    public selectedCategory: string = 'all';
    public categories = [
        { name: 'All Categories', key: 'all' },
        { name: 'Nature', key: 'nature' },
        { name: 'Architecture', key: 'architecture' },
    ];

    public navigateToFeed(): void {
        this._router.navigate(['/feed']);
    }

    public navigateToExplore(): void {
        this._router.navigate(['/explore']);
    }

    public onSearch(): void {
        const queryParams: Record<string, string> = {
            q: this.value,
            category: this.selectedCategory,
        };

        this._router.navigate(['/photo-search'], {
            queryParams,
            queryParamsHandling: 'merge',
        });
    }

    public onUploadClick(): void {
        this._router.navigate([{ outlets: { dialog: ['photo-upload'] } }]);
    }
}