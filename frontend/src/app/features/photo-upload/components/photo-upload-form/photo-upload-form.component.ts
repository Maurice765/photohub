import { Component, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CameraModelSelectorComponent } from "@shared/components/camera-model-selector/camera-model-selector.component";
import { DatePickerComponent } from "@shared/components/date-picker/date-picker.component";
import { FileUploadComponent } from "@shared/components/file-upload/file-upload.component";
import { LocationSelectorComponent } from "@shared/components/location-selector/location-selector.component";
import { VisibilitySelectorComponent } from "@shared/components/visibility-selector/visibility-selector.component";
import { DatePickerModule } from "primeng/datepicker";
import { FloatLabel } from "primeng/floatlabel";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: "photo-upload-form",
    imports: [
        FormsModule,
        ReactiveFormsModule, 
        FloatLabel,
        MessageModule,
        InputTextModule, 
        TextareaModule,
        DatePickerModule,
        InputGroupModule,
        InputGroupAddonModule,
        FileUploadComponent,
        CameraModelSelectorComponent,
        LocationSelectorComponent,
        VisibilitySelectorComponent,
        DatePickerComponent,
    ],
    templateUrl: "./photo-upload-form.component.html",
    styleUrls: ["./photo-upload-form.component.css"],
})
export class PhotoUploadFormComponent {
    private formBuilder: FormBuilder = inject(FormBuilder);
    private formSubmitted = signal(false);

    public uploadForm: FormGroup;

    constructor() {
        this.uploadForm = this.formBuilder.group({
            file: [null, Validators.required],
            title: ['', Validators.required],
            visibility: [null, Validators.required],
            description: ['', Validators.maxLength(500)],
            location: [null],
            cameraModel: [null],
            captureDate: [null],
        });
    }

    public isInvalid(controlName: string): boolean | undefined {
        const control = this.uploadForm.get(controlName);
        return control?.invalid && (control.touched || this.formSubmitted());
    }

    public markAsSubmitted(): void {
        this.formSubmitted.set(true);
        this.uploadForm.markAllAsTouched();
    }
}   