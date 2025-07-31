import { CommonModule, NgOptimizedImage } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { PhotoDetailViewModel } from "@features/photo-search/models/photo-detail.view-model";
import { PhotoDetailService } from "@features/photo-search/services/photo-detail.service";
import { CAMERA_MODELS } from "@shared/constants/camera-models.const";
import { LOCATIONS } from "@shared/constants/locations.const";
import { FileService } from "@shared/services/file.service";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";

@Component({
    selector: "photo-detail",
    imports: [
        CommonModule,
        NgOptimizedImage,
        ButtonModule,
        DialogModule,
    ],
    templateUrl: "./photo-detail.component.html",
    styleUrls: ["./photo-detail.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoDetailComponent {
    private messageService = inject(MessageService);
    private fileService = inject(FileService);
    private photoDetailService = inject(PhotoDetailService);

    private locations = LOCATIONS;
    private cameraModels = CAMERA_MODELS;

    public visible = signal<boolean>(false);
    public photoDetailModel: PhotoDetailViewModel = new PhotoDetailViewModel();

    public closeDialog(): void {
        this.visible.set(false);
        this.photoDetailModel = new PhotoDetailViewModel();
    }

    public openDialog(photoId: number): void {
        this.visible.set(true);
        this.photoDetailService.getPhotoDetail(photoId).subscribe({
            next: (photoDetail) => {
                this.photoDetailModel = photoDetail;
            },
            error: (error) => {
                this.closeDialog();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Photo Detail Error',
                    detail: 'An unexpected error occurred while loading photo details.',
                });
            }
        });
    }

    public formatFileSize(bytes?: number): string {
        if (!bytes) return '';

        return this.fileService.formatSize(bytes);
    }

    public formatDate(dateString?: string): string {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    }

    public formatLocation(location?: string): string {
        if (!location) return '';

        const locationObject = this.locations.find(loc => loc.key === location);
        return locationObject ? locationObject.name : location;
    }

    public formatCameraModel(cameraModel?: string): string {
        if (!cameraModel) return '';

        const cameraObject = this.cameraModels.find(cam => cam.key === cameraModel);
        return cameraObject ? cameraObject.name : cameraModel;
    }
}