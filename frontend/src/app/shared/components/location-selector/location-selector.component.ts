import { Component } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { LOCATIONS } from "@shared/constants/locations.const";

import { FloatLabelModule } from "primeng/floatlabel";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { SelectChangeEvent, SelectModule } from "primeng/select";

@Component({
    selector: "location-selector",
    imports: [
        FormsModule,
        InputGroupModule,
        InputGroupAddonModule,
        FloatLabelModule,
        SelectModule
    ],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        multi: true,
        useExisting: LocationSelectorComponent
    }],
    templateUrl: "./location-selector.component.html",
    styleUrls: ["./location-selector.component.css"],
})
export class LocationSelectorComponent implements ControlValueAccessor {
    public locations = LOCATIONS;
    public selectedLocation: string | null = null;
    public disabled: boolean = false;
    public touched: boolean = false;

    public onChange = (location: string | null) => { };
    public onTouched = () => { };

    public onLocationChange(event: SelectChangeEvent): void {
        this.markAsTouched();
        if (!this.disabled) {
            this.onChange(this.selectedLocation);
        }
    }

    public writeValue(location: string | null): void {
        this.selectedLocation = location;
    }

    public registerOnChange(onChange: any): void {
        this.onChange = onChange;
    }

    public registerOnTouched(onTouched: any): void {
        this.onTouched = onTouched;
    }

    public markAsTouched(): void {
        if (!this.touched) {
            this.onTouched();
            this.touched = true;
        }
    }

    public setDisabledState(disabled: boolean): void {
        this.disabled = disabled;
    }
}