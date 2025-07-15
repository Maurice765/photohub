import { Component } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FilterFormModel } from "@features/photo-search/models/filter-form.model";
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
    public filterForm = new FormGroup<FilterFormModel>({
        rgbColor: new FormControl<RGBColor | null>(null),
        orientation: new FormControl<string | null>(null),
        minWidth: new FormControl<number | null>(null),
        minHeight: new FormControl<number | null>(null),
        uploadDateRange: new FormControl<Date[] | null>(null),
        captureDateRange: new FormControl<Date[] | null>(null),
        location: new FormControl<string | null>(null),
        cameraModel: new FormControl<string | null>(null),
        fileFormat: new FormControl<string | null>(null),
    });

    public orientations = [
        { name: 'Landscape', key: 'landscape' },
        { name: 'Portrait', key: 'portrait' },
        { name: 'Square', key: 'square' },
    ];

    public fileFormats = [
        { name: 'JPG', key: 'jpg' },
        { name: 'PNG', key: 'png' },
    ];
}