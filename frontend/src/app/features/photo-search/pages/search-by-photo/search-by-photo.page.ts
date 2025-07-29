import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, signal, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FilterPanelComponent } from "@features/photo-search/components/filter-panel/filter-panel.component";
import { PhotoGridComponent } from "@features/photo-search/components/photo-grid/photo-grid.component";
import { PhotoGridViewModel } from "@features/photo-search/models/photo-grid.view-model";
import { PhotoSearchService } from "@features/photo-search/services/photo-search.service";
import { FileUploadComponent } from "@shared/components/file-upload/file-upload.component";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";

@Component({
    selector: "photo-search-page",
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        FileUploadComponent,
        PhotoGridComponent
    ],
    templateUrl: "./search-by-photo.page.html",
    styleUrls: ["./search-by-photo.page.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchByPhotoPage {
    private photoSearchService = inject(PhotoSearchService);
    private messageService = inject(MessageService);

    public uploadedFile: File | null = null;
    public photoGridViewModel = signal<PhotoGridViewModel>(new PhotoGridViewModel([]));

    public searchByPhoto(): void {
        if (!this.uploadedFile) {
            this.messageService.add({
                severity: 'warn',
                summary: 'No File Selected',
                detail: 'Please select a photo file to search.'
            });
            return;
        }

        this.photoSearchService.searchByPhoto(this.uploadedFile).subscribe({
            next: (result: PhotoGridViewModel) => {
                this.photoGridViewModel.set(result);
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Search Failed',
                    detail: 'An unexpected error occurred while searching for photos.'
                });
            }
        });
    }
}