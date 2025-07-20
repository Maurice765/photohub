import { Component, signal } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FilterPanelFormViewModel } from "@features/photo-search/models/filter-panel-form.view-model";
import { CameraModelSelectorComponent } from "@shared/components/camera-model-selector/camera-model-selector.component";
import { DatePickerComponent } from "@shared/components/date-picker/date-picker.component";
import { LocationSelectorComponent } from "@shared/components/location-selector/location-selector.component";
import { RGBColor } from "@shared/models/rgbColor.interface";
import { RgbColorPickerComponent } from "@shared/components/rgb-color-picker/rgb-color-picker.component";
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { PanelModule } from 'primeng/panel';
import { SelectModule } from 'primeng/select';
import { ORIENTATIONS } from "@shared/constants/orientations.const";
import { FILE_FORMATS } from "@shared/constants/file-formats.const";
import { OrientationClientEnum } from "@core/clients/enums/orientation.client-enum";
import { FileFormatClientEnum } from "@core/clients/enums/file-format.client-enum";
import { FilterPanelViewModel } from "@features/photo-search/models/filter-panel.view-model";

@Component({
    selector: "filter-panel",
    imports: [
        FormsModule,
        ReactiveFormsModule,
        PanelModule,
        InputGroupModule,
        InputGroupAddonModule,
        SelectModule,
        InputNumberModule,
        FloatLabelModule,
        RgbColorPickerComponent,
        LocationSelectorComponent,
        CameraModelSelectorComponent,
        DatePickerComponent
    ],
    templateUrl: "./filter-panel.component.html",
    styleUrls: ["./filter-panel.component.css"],
})
export class FilterPanelComponent {
    private formSubmitted = signal(false);
    
    public orientations = ORIENTATIONS;
    public fileFormats = FILE_FORMATS;

    public filterForm = new FormGroup<FilterPanelFormViewModel>({
        rgbColor: new FormControl<RGBColor | null>(null),
        minWidth: new FormControl<number | null>(null),
        minHeight: new FormControl<number | null>(null),
        orientation: new FormControl<OrientationClientEnum | null>(null),
        fileFormat: new FormControl<FileFormatClientEnum | null>(null),
        location: new FormControl<string | null>(null),
        cameraModel: new FormControl<string | null>(null),
        uploadDateRange: new FormControl<Date[] | null>(null),
        captureDateRange: new FormControl<Date[] | null>(null),
    });

    public getFilterFormValue(): FilterPanelViewModel | null {
        this.markAsSubmitted();

        if (this.filterForm.invalid) {
            return null;
        }

        const formValue = this.filterForm.getRawValue();
        return new FilterPanelViewModel(formValue);
    }

    private markAsSubmitted(): void {
        this.formSubmitted.set(true);
        this.filterForm.markAllAsTouched();
    }
}