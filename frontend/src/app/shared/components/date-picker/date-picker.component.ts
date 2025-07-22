import { ChangeDetectionStrategy, Component, forwardRef, input, output } from "@angular/core";
import { AbstractControl, ControlValueAccessor, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from "@angular/forms";
import { DatePickerModule } from "primeng/datepicker";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { FormErrorMessageComponent } from "../form-error-message/form-error-message.component";

@Component({
    selector: "date-picker",
    imports: [
        FormsModule,
        InputGroupModule,
        InputGroupAddonModule,
        FloatLabelModule,
        DatePickerModule,
        FormErrorMessageComponent
    ],
    providers: [{
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => DatePickerComponent),
        },
        {
            provide: NG_VALIDATORS,
            multi: true,
            useExisting: forwardRef(() => DatePickerComponent),
        }],
    templateUrl: "./date-picker.component.html",
    styleUrls: ["./date-picker.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent implements ControlValueAccessor, Validator {
    public label = input<string>('');
    public selectionMode = input<'single' | 'multiple' | 'range'>('single');
    
    public selectedDate: Date[] | Date | null = null;
    public disabled: boolean = false;
    public touched: boolean = false;
    public isInvalid: boolean = false;
    public maxDate = input<Date>(new Date());

    public onChange = (date: Date[] | Date | null) => { };
    public onTouched = () => { };

    public onDateChange(): void {
        this.markAsTouched();
        if (!this.disabled) {
            this.onChange(this.selectedDate);
        }
    }

    public writeValue(date: Date[] | Date | null): void {
        this.selectedDate = date;
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

    public validate(control: AbstractControl<Date[] | Date>): ValidationErrors | null {
        const value = control.value;

        if (!value) {
            return null;
        }

        if (this.selectionMode() === 'range') {
            if (!Array.isArray(value) || value.length !== 2 || !value[0] || !value[1]) {
                return { dateRange: { valid: false } };
            }
            const [start, end] = value;
            if (start > end) {
                return { dateRange: { valid: false } };
            }
        }
        return null;
    }
}