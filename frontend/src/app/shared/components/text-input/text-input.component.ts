import { Component, forwardRef, input } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from "primeng/inputtext";
import { FormErrorMessageComponent } from "../form-error-message/form-error-message.component";

@Component({
    selector: "text-input",
    imports: [
        FormsModule,
        FloatLabelModule,
        InputTextModule,
        FormErrorMessageComponent
    ],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        multi: true,
        useExisting: forwardRef(() => TextInputComponent),
    }],
    templateUrl: "./text-input.component.html",
    styleUrls: ["./text-input.component.css"],
})
export class TextInputComponent implements ControlValueAccessor {
    public label = input<string>('');

    public text: string | null = null;
    public disabled: boolean = false;
    public touched: boolean = false;
    public isInvalid: boolean = false;

    public onChange = (text: string | null) => { };
    public onTouched = () => { };

    public onTextChange(): void {
        this.markAsTouched();
        if (!this.disabled) {
            this.onChange(this.text);
        }
    }

    public writeValue(text: string | null): void {
        this.text = text;
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