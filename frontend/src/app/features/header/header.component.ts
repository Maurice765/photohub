import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
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
import { SearchBarService } from "./services/search-bar.service";

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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
    private router: Router = inject(Router);
    private searchBarService = inject(SearchBarService);


    public query: string = '';
    public selectedCategory: string = 'all';
    public categories = [
        { name: 'All Categories', key: 'all' },
        { name: 'Nature', key: 'nature' },
        { name: 'Architecture', key: 'architecture' },
    ];

    public navigateToFeed(): void {
        this.router.navigate(['/feed']);
    }

    public navigateToExplore(): void {
        this.router.navigate(['/explore']);
    }

    public onSearch(): void {
        this.searchBarService.triggerSearch(this.query, this.selectedCategory);

        this.router.navigate(['/photo-search'], {
            skipLocationChange: false,
        });
    }

    public onUploadClick(): void {
        this.router.navigate([{ outlets: { dialog: ['photo-upload'] } }]);
    }
}