import { ChangeDetectionStrategy, Component, forwardRef } from "@angular/core";
import { AbstractControl, ControlValueAccessor, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from "@angular/forms";
import { LOCATIONS } from "@shared/constants/locations.const";

import { FloatLabelModule } from "primeng/floatlabel";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { SelectChangeEvent, SelectModule } from "primeng/select";
import { FormErrorMessageComponent } from "../form-error-message/form-error-message.component";
import { SelectorItem } from "@shared/models/selector-item.interface";

@Component({
    selector: "location-selector",
    imports: [
        FormsModule,
        InputGroupModule,
        InputGroupAddonModule,
        FloatLabelModule,
        SelectModule,
        FormErrorMessageComponent
    ],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        multi: true,
        useExisting: forwardRef(() => LocationSelectorComponent),
    }],
    templateUrl: "./location-selector.component.html",
    styleUrls: ["./location-selector.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationSelectorComponent implements ControlValueAccessor {
    public locations: SelectorItem[] = LOCATIONS;
    public selectedLocation: string | null = null;
    public disabled: boolean = false;
    public touched: boolean = false;
    public isInvalid: boolean = false;

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