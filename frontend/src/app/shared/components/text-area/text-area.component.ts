import { Component, forwardRef, input } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FloatLabelModule } from "primeng/floatlabel";
import { TextareaModule } from "primeng/textarea";
import { FormErrorMessageComponent } from "../form-error-message/form-error-message.component";

@Component({
    selector: "text-area",
    imports: [
        FormsModule,
        FloatLabelModule,
        TextareaModule,
        FormErrorMessageComponent
    ],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        multi: true,
        useExisting: forwardRef(() => TextAreaComponent),
    }],
    templateUrl: "./text-area.component.html",
    styleUrls: ["./text-area.component.css"],
})
export class TextAreaComponent implements ControlValueAccessor {
    public label = input<string>('');
    public rows = input<number>(4);

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