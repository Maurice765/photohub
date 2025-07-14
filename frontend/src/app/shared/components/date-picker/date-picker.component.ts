import { Component, input } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { DatePickerModule } from "primeng/datepicker";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";

@Component({
    selector: "date-picker",
    imports: [
        FormsModule,
        InputGroupModule,
        InputGroupAddonModule,
        FloatLabelModule,
        DatePickerModule
    ],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        multi: true,
        useExisting: DatePickerComponent
    }],
    templateUrl: "./date-picker.component.html",
    styleUrls: ["./date-picker.component.css"],
})
export class DatePickerComponent implements ControlValueAccessor {
    public label = input<string>('');
    public selectionMode = input<'single' | 'multiple' | 'range'>('single');
    
    public selectedDate: Date[] | Date | null = null;
    public disabled: boolean = false;
    public touched: boolean = false;

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
}