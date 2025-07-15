import { Component } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { ColorPickerChangeEvent, ColorPickerModule } from "primeng/colorpicker";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputNumberModule } from "primeng/inputnumber";
import { RGBColor } from "../../models/rgbColor.interface";
import { ButtonModule } from "primeng/button";
import { FloatLabelModule } from "primeng/floatlabel";

@Component({
    selector: "rgb-color-picker",
    imports: [
        FormsModule,
        ReactiveFormsModule,
        InputGroupModule,
        InputGroupAddonModule,
        ColorPickerModule,
        InputNumberModule,
        ButtonModule,
        FloatLabelModule
    ],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        multi: true,
        useExisting: RgbColorPickerComponent
    }],
    templateUrl: "./rgb-color-picker.component.html",
    styleUrls: ["./rgb-color-picker.component.css"],
})
export class RgbColorPickerComponent implements ControlValueAccessor {

    public rgbColor: RGBColor | null = null;
    public disabled: boolean = false;
    public touched: boolean = false;

    public onChange = (rgbColor: RGBColor | null) => { };
    public onTouched = () => { };

    public onColorPickerChange(event: ColorPickerChangeEvent): void {
        this.handleColorChange();
    }

    public onColorInputChange(channel: 'r' | 'g' | 'b', value: number): void {
        if (!this.rgbColor) {
            this.rgbColor = { r: 0, g: 0, b: 0 };
        }
        this.rgbColor[channel] = value;
        this.handleColorChange();
    }

    public onClearColor(): void {
        this.rgbColor = null;
        this.handleColorChange();
    }

    public writeValue(rgbColor: RGBColor | null): void {
        this.rgbColor = rgbColor;
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

    private handleColorChange(): void {
        this.markAsTouched();
        if (!this.disabled) {
            this.onChange(this.rgbColor);
        }
    }
}