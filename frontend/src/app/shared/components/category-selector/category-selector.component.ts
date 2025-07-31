import { ChangeDetectionStrategy, Component, forwardRef, inject, input, OnInit } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { SelectorItem } from "@shared/models/selector-item.interface";
import { CategoryService } from "@shared/services/category.service";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { SelectChangeEvent, SelectModule } from "primeng/select";
import { FormErrorMessageComponent } from "../form-error-message/form-error-message.component";

@Component({
    selector: "category-selector",
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
        useExisting: forwardRef(() => CategorySelectorComponent),
    }],
    templateUrl: "./category-selector.component.html",
    styleUrls: ["./category-selector.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategorySelectorComponent implements ControlValueAccessor, OnInit {
    private categoryService = inject(CategoryService);

    public categories: SelectorItem[] = [];
    public selectedCategory: number | null = null;
    public disabled: boolean = false;
    public touched: boolean = false;
    public isInvalid: boolean = false;

    public onChange = (category: number | null) => { };
    public onTouched = () => { };

    public ngOnInit(): void { 
        this.categoryService.getCategorySelectorItems().subscribe(
            (categories: SelectorItem[]) => {
                this.categories = categories;
            }
        );
    }

    public onCategoryChange(event: SelectChangeEvent): void {
        this.markAsTouched();
        if (!this.disabled) {
            this.onChange(this.selectedCategory);
        }
    }

    public writeValue(category: number | null): void {
        this.selectedCategory = category;
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