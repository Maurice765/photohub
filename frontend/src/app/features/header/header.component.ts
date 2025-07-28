import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
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
import { CategoryService } from "@shared/services/category.service";
import { SelectorItem } from "@shared/models/selector-item.interface";

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
export class HeaderComponent implements OnInit {
    private router: Router = inject(Router);
    private categoryService = inject(CategoryService);
    private searchBarService = inject(SearchBarService);

    ngOnInit(): void {
        this.categoryService.getCategorySelectorItems().subscribe(categories => {
            this.categories.push(...categories);
        });
    }

    public query: string = '';
    public selectedCategoryId: number = -1;
    public categories: SelectorItem[] = [
        { name: 'All Categories', key: -1 }
    ];

    public navigateToFeed(): void {
        this.router.navigate(['/feed']);
    }

    public navigateToExplore(): void {
        this.router.navigate(['/explore']);
    }

    public onSearch(): void {
        this.searchBarService.triggerSearch(this.query, this.selectedCategoryId);

        this.router.navigate(['/photo-search'], {
            skipLocationChange: false,
        });
    }

    public onUploadClick(): void {
        this.router.navigate([{ outlets: { dialog: ['photo-upload'] } }]);
    }
}