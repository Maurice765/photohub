import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
    private messageService = inject(MessageService);
    private photoSearchService = inject(PhotoSearchService);
    private filterPanel = viewChild.required(FilterPanelComponent);

    public photoGridViewModel = signal<PhotoGridViewModel>(new PhotoGridViewModel([]));

    public searchPhotos(): void {
        const filterPanel = this.filterPanel();

        const filterFormValue = filterPanel.getFilterFormValue();
        if (!filterFormValue) {
            return;
        }

        const photoSearchViewModel = new PhotoSearchViewModel();

        this.photoSearchService.searchPhotos(photoSearchViewModel).subscribe({
            next: (result: PhotoGridViewModel) => {
                this.photoGridViewModel.set(result);
            },
            error: (err) => {
                this.messageService.add({severity: 'error', summary: 'Search Failed', detail: 'An unexpected error occurred while searching for photos.'});
            }
        });
    }
}