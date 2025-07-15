import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Component, forwardRef, inject, input, model, output } from "@angular/core";
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl, ValidationErrors, Validator } from "@angular/forms";
import { PrimeNG } from 'primeng/config';
import { FileSelectEvent, FileUploadModule } from "primeng/fileupload";
import { MessageModule } from "primeng/message";

@Component({
    selector: "file-upload",
    imports: [
        CommonModule,
        FileUploadModule,
        MessageModule
    ],
    providers: [{
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => FileUploadComponent), 
        }, 
        {
            provide: NG_VALIDATORS,
            multi: true,
            useExisting: forwardRef(() => FileUploadComponent), 
        }],
    templateUrl: "./file-upload.component.html",
    styleUrls: ["./file-upload.component.css"],
})
export class FileUploadComponent implements ControlValueAccessor, Validator {
    private primengConfig: PrimeNG = inject(PrimeNG);
    private control: AbstractControl<File> | null = null;

    public maxFileSize = input<number>(10 * 1024 * 1024); // 10 MB
    public acceptedFileTypes = input<string>("image/jpeg, image/png");

    public selectedFile: File | null = null;
    public disabled: boolean = false;
    public touched: boolean = false;

    public onChange = (file: File | null) => { };
    public onTouched = () => { };

    public onSelectedFiles(event: FileSelectEvent): void {
        const file = event.files?.[0];
        this.markAsTouched();
        if (!this.disabled) {
            this.selectedFile = file;
            this.onChange(this.selectedFile);
        }
    }

    public writeValue(file: File | null): void {
        this.selectedFile = file;
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

    public validate(control: AbstractControl<File>): ValidationErrors | null {
        this.control = control;

        const file = control.value;
        if (file && file.size > this.maxFileSize()) {
            return { 'maxFileSize': { maxFileSize: this.maxFileSize() } };
        }
        return null;
    }

    public hasError(): boolean {
        return !!(this.control?.invalid && this.control?.touched);
    }

    public getErrorMessage(): string | null {
        if (!this.control?.errors) return null;
        
        const errorObj = this.control.errors;
        
        if (errorObj['required']) {
            return 'File is required';
        }
        if (errorObj['maxFileSize']) {
            const { maxFileSize } = errorObj['maxFileSize'];
            return `Invalid file size, maximum upload size is ${this.formatSize(maxFileSize)}.`
        }
        
        return null;
    }

    public formatSize(bytes: number): string {
        const k = 1024;
        const dm = 3;
        const sizes = this.primengConfig.translation.fileSizeTypes;
        if (bytes === 0) {
            return `0 ${sizes?.[0] ?? "B"}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

        return `${formattedSize} ${sizes?.[i]}`;
    }
}