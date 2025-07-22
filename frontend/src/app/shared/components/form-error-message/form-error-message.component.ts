import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { merge, startWith, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'form-error-message',
    imports: [
        CommonModule,
        MessageModule
    ],
    templateUrl: './form-error-message.component.html',
    styleUrls: ['./form-error-message.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormErrorMessageComponent implements OnInit, OnDestroy {
    private ngControl: NgControl = inject(NgControl);
    private destroy$ = new Subject<void>();

    public label = input<string>('');
    public invalidState = output<boolean>();

    ngOnInit(): void {
        if (this.ngControl?.control) {
            merge(
                this.ngControl.control.statusChanges,
                this.ngControl.control.valueChanges
            ).pipe(
                startWith(null),
                takeUntil(this.destroy$)
            ).subscribe(() => {
                this.invalidState.emit(this.hasError());
            });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public hasError(): boolean {
        return !!(this.ngControl?.control?.invalid && this.ngControl?.control?.touched);
    }

    public getErrorMessage(): string | null {
        const errors = this.ngControl?.control?.errors;
        const fieldName = this.label() || 'Field';

        if (!errors) {
            return null;
        }

        if (errors['required']) return `${fieldName} is required.`;
        if (errors['maxlength']) return `${fieldName} must not exceed ${errors['maxlength'].requiredLength} characters.`;
        if (errors['minlength']) return `${fieldName} must be at least ${errors['minlength'].requiredLength} characters.`;
        if (errors['pattern']) return `${fieldName} has an invalid format.`;

        return 'Invalid field.';
    }
}

