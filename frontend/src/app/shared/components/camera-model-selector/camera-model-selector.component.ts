import { Component, forwardRef, inject } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgControl } from "@angular/forms";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { SelectChangeEvent, SelectModule } from "primeng/select";
import { CAMERA_MODELS } from '@shared/constants/camera-models.const';
import { MessageModule } from "primeng/message";
import { FormErrorMessageComponent } from "../form-error-message/form-error-message.component";

@Component({
    selector: "camera-model-selector",
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
        useExisting: forwardRef(() => CameraModelSelectorComponent),
    }],
    templateUrl: "./camera-model-selector.component.html",
    styleUrls: ["./camera-model-selector.component.css"],
})
export class CameraModelSelectorComponent implements ControlValueAccessor {
    public cameraModels = CAMERA_MODELS;
    public selectedCameraModel: string | null = null;
    public disabled: boolean = false;
    public touched: boolean = false;
    public isInvalid: boolean = false;
    
    public onChange = (cameraModel: string | null) => { };
    public onTouched = () => { };

    public onCameraModelChange(event: SelectChangeEvent): void {
        this.markAsTouched();
        if (!this.disabled) {
            this.onChange(this.selectedCameraModel);
        }
    }

    public writeValue(cameraModel: string | null): void {
        this.selectedCameraModel = cameraModel;
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