import { ChangeDetectionStrategy, Component, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { VISIBILITIES } from "@shared/constants/visibilities.const";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { SelectChangeEvent, SelectModule } from "primeng/select";
import { FormErrorMessageComponent } from "../form-error-message/form-error-message.component";
import { VisibilityClientEnum } from "@core/clients/enums/visibility.client-enum";

@Component({
    selector: "visibility-selector",
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
        useExisting: forwardRef(() => VisibilitySelectorComponent),
    }],
    templateUrl: "./visibility-selector.component.html",
    styleUrls: ["./visibility-selector.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisibilitySelectorComponent implements ControlValueAccessor {
    public visibilities = VISIBILITIES;
    public selectedVisibility: VisibilityClientEnum | null = null;
    public disabled: boolean = false;
    public touched: boolean = false;
    public isInvalid: boolean = false;

    public onChange = (visibility: VisibilityClientEnum | null) => { };
    public onTouched = () => { };

    public onVisibilityChange(event: SelectChangeEvent): void {
        this.markAsTouched();
        if (!this.disabled) {
            this.onChange(this.selectedVisibility);
        }
    }

    public writeValue(visibility: VisibilityClientEnum | null): void {
        this.selectedVisibility = visibility;
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