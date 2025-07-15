import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FilterPanelComponent } from "@features/photo-search/components/filter-panel/filter-panel.component";
import { PhotoGridComponent } from "@features/photo-search/components/photo-grid/photo-grid.component";
import { FilterPanelViewModel } from "@features/photo-search/models/filter-panel.view-model";
import { PhotoSearchResultItemViewModel } from "@features/photo-search/models/photo-search-result-item.view-model";
import { PhotoSearchService } from "@features/photo-search/services/photo-search.service";
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
})
export class PhotoSearchPage {
    @ViewChild(FilterPanelComponent)
    private filterPanel!: FilterPanelComponent;

    private photoSearchService = inject(PhotoSearchService);

    public photos = signal<PhotoSearchResultItemViewModel[]>([]);

    public searchPhotos(): void {
        const filters = this.filterPanel.filterForm.value;
        let filterViewModel = new FilterPanelViewModel(filters);
        console.log('Filter ViewModel:', filterViewModel);

        if (filterViewModel.color) {
            this.photoSearchService.searchPhotos(filterViewModel.color, 10).subscribe({
                next: (result: PhotoSearchResultItemViewModel[]) => {
                    console.log('Search results:', result);
                    this.photos.set(result);
                },
                error: (error) => {
                    console.error('Search error:', error);
                }
            });
        }
    }
}