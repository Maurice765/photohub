import { AbstractControl } from "@angular/forms";

export type FormGroupValue<T extends { [K in keyof T]: AbstractControl }> = {
    [K in keyof T]: T[K]['value']
};