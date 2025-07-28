import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from "@angular/core";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SearchBarViewModel } from "@features/header/models/search-bar.view-model";
import { SearchBarService, } from "@features/header/services/search-bar.service";
import { FilterPanelComponent } from "@features/photo-search/components/filter-panel/filter-panel.component";
import { PhotoGridComponent } from "@features/photo-search/components/photo-grid/photo-grid.component";
import { PhotoGridViewModel } from "@features/photo-search/models/photo-grid.view-model";
import { PhotoSearchViewModel } from "@features/photo-search/models/photo-search.view-model";
import { PhotoSearchService } from "@features/photo-search/services/photo-search.service";
import { MessageService } from "primeng/api";
import { ButtonModule } from 'primeng/button';

@Component({
    selector: "photo-search-page",
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        FilterPanelComponent,
        PhotoGridComponent
    ],
    templateUrl: "./photo-search.page.html",
    styleUrls: ["./photo-search.page.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoSearchPage {
    private searchBarService = inject(SearchBarService);
    private messageService = inject(MessageService);
    private photoSearchService = inject(PhotoSearchService);
    private filterPanelComponent = viewChild.required(FilterPanelComponent);

    public photoGridViewModel = signal<PhotoGridViewModel>(new PhotoGridViewModel([]));

    constructor() {
        this.searchBarService.searchTrigger$
        .pipe(takeUntilDestroyed())
        .subscribe((search: SearchBarViewModel | null) => {
            if (search) {
                this.searchPhotos(search.categoryId, search.query);
            }
        });
    }

    public searchPhotos(categoryId: number, query: string): void {
        const filterViewModel = this.filterPanelComponent()?.getFilterPanelViewModel();
        const photoSearchViewModel = new PhotoSearchViewModel(categoryId, query, filterViewModel);

        this.photoSearchService.searchPhotos(photoSearchViewModel).subscribe({
            next: (result: PhotoGridViewModel) => {
                this.photoGridViewModel.set(result);
            },
            error: (err) => {
                if (err.status === 422) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Missing Filters',
                        detail: 'Please provide at least one search filter to perform a photo search.'
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Search Failed',
                        detail: 'An unexpected error occurred while searching for photos.'
                    });
                }
            }
        });
    }
}