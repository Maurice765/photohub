import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from "@angular/core";
import { Router } from "@angular/router";
import { PhotoUploadFormComponent } from "@features/photo-upload/components/photo-upload-form/photo-upload-form.component";
import { PhotoUploadViewModel } from "@features/photo-upload/models/photo-upload.view-model";
import { PhotoUploadService } from "@features/photo-upload/services/photo-upload.service";
import { FileUploadComponent } from "@shared/components/file-upload/file-upload.component";
import { ButtonModule } from "primeng/button";
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from "primeng/inputtext";
import { finalize } from "rxjs";

@Component({
    selector: "photo-upload-dialog",
    imports: [
        CommonModule, 
        DialogModule, 
        ButtonModule, 
        InputTextModule, 
        PhotoUploadFormComponent
    ],
    templateUrl: "./photo-upload.dialog.html",
    styleUrls: ["./photo-upload.dialog.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoUploadDialog {
    private router = inject(Router);
    private photoUploadService = inject(PhotoUploadService);
    private uploadFormComponent = viewChild.required(PhotoUploadFormComponent);

    public visible = signal(true);
    public isUploading = signal(false);

    public uploadPhoto(): void {
        const formComponent = this.uploadFormComponent();

        formComponent.markAsSubmitted();

        if (formComponent.uploadForm.invalid) {
            return;
        }

        this.isUploading.set(true);

        const formValue = formComponent.uploadForm.value;
        const photoUploadViewModel = new PhotoUploadViewModel(formValue);

        this.photoUploadService.uploadPhoto(photoUploadViewModel).pipe(
            finalize(() => this.isUploading.set(false))
        ).subscribe({
            next: (response) => {
                this.closeDialog();
            },
            error: (err) => {
            }
        });
    }

    public closeDialog(): void {
        this.router.navigate([{ outlets: { dialog: null } }]);
    }

    public uploadDisabled(): boolean {
        return this.uploadFormComponent().uploadForm.invalid || this.isUploading();
    }
}