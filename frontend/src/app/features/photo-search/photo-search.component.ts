import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from 'primeng/button';
import { FilterPanelComponent } from "./components/filter-panel/filter-panel.component";
import { PhotoGridComponent } from "./components/photo-grid/photo-grid.component";
import { FilterPanelViewModel } from "./models/filter-panel.view-model";
import { PhotoSearchResultItemViewModel } from "./models/photo-search-result-item.view-model";
import { PhotoSearchService } from "./services/photo-search.service";

@Component({
    selector: "app-photo-search",
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        FilterPanelComponent,
        PhotoGridComponent
    ],
    templateUrl: "./photo-search.component.html",
    styleUrls: ["./photo-search.component.css"],
})
export class PhotoSearchComponent {
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