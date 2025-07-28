import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { VisibilityClientEnum } from "@core/clientEnums/visibility.client-enum";
import { PhotoUploadFormViewModel } from "@features/photo-upload/models/photo-upload-form.view-model";
import { CameraModelSelectorComponent } from "@shared/components/camera-model-selector/camera-model-selector.component";
import { CategorySelectorComponent } from "@shared/components/category-selector/category-selector.component";
import { DatePickerComponent } from "@shared/components/date-picker/date-picker.component";
import { FileUploadComponent } from "@shared/components/file-upload/file-upload.component";
import { LocationSelectorComponent } from "@shared/components/location-selector/location-selector.component";
import { TextAreaComponent } from "@shared/components/text-area/text-area.component";
import { TextInputComponent } from "@shared/components/text-input/text-input.component";
import { VisibilitySelectorComponent } from "@shared/components/visibility-selector/visibility-selector.component";

@Component({
    selector: "photo-upload-form",
    imports: [
        FormsModule,
        ReactiveFormsModule, 
        TextInputComponent,
        TextAreaComponent,
        FileUploadComponent,
        CameraModelSelectorComponent,
        LocationSelectorComponent,
        VisibilitySelectorComponent,
        DatePickerComponent,
        CategorySelectorComponent
    ],
    templateUrl: "./photo-upload-form.component.html",
    styleUrls: ["./photo-upload-form.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoUploadFormComponent {
    private formSubmitted = signal(false);

    public uploadForm = new FormGroup<PhotoUploadFormViewModel>({
        file: new FormControl<File | null>(null, Validators.required),
        title: new FormControl<string | null>(null, { validators: [Validators.required, Validators.maxLength(255)] }),
        visibility: new FormControl<VisibilityClientEnum | null>(null, Validators.required),
        categoryId: new FormControl<number | null>(null),
        description: new FormControl<string | null>(null, Validators.maxLength(255)),
        location: new FormControl<string | null>(null, Validators.maxLength(255)),
        cameraModel: new FormControl<string | null>(null, Validators.maxLength(255)),
        captureDate: new FormControl<Date | null>(null),
    });

    public markAsSubmitted(): void {
        this.formSubmitted.set(true);
        this.uploadForm.markAllAsTouched();
    }
}   