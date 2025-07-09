import { Component } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FilterFormModel } from "@features/photo-search/models/filter-form.model";
import { RGBColor } from "@shared/rgb-color-picker/models/rgbColor.interface";
import { RgbColorPickerComponent } from "@shared/rgb-color-picker/rgb-color-picker.component";
import { ButtonModule } from "primeng/button";
import { ColorPickerModule } from "primeng/colorpicker";
import { DatePickerModule } from 'primeng/datepicker';
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
        ColorPickerModule,
        ButtonModule,
        InputGroupModule,
        InputGroupAddonModule,
        SelectModule,
        InputNumberModule,
        DatePickerModule,
        FloatLabelModule,
        PanelModule,
        RgbColorPickerComponent
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
        country: new FormControl<string | null>(null),
        cameraModel: new FormControl<string | null>(null),
        fileFormat: new FormControl<string | null>(null),
    });

    public orientations = [
        { name: 'Landscape', key: 'landscape' },
        { name: 'Portrait', key: 'portrait' },
        { name: 'Square', key: 'square' },
    ];

    public countries = [
        { name: 'Australia', key: 'AU' },
        { name: 'Brazil', key: 'BR' },
        { name: 'China', key: 'CN' },
        { name: 'Egypt', key: 'EG' },
        { name: 'France', key: 'FR' },
        { name: 'Germany', key: 'DE' },
        { name: 'India', key: 'IN' },
        { name: 'Japan', key: 'JP' },
        { name: 'Spain', key: 'ES' },
        { name: 'United States', key: 'US' },
    ];

    public cameraModels = [
        { name: 'iPhone 11', key: 'iphone11' },
        { name: 'iPhone 12', key: 'iphone12' },
        { name: 'Samsung Galaxy S21', key: 'galaxyS21' },
        { name: 'Google Pixel 6', key: 'pixel6' },
    ];

    public fileFormats = [
        { name: 'JPG', key: 'jpg' },
        { name: 'PNG', key: 'png' },
    ];
}