import { FormControl, FormGroup } from '@angular/forms';

export interface RgbColorForm {
    r: FormControl<number | null>;
    g: FormControl<number | null>;
    b: FormControl<number | null>;
}

export interface FilterFormModel {
    rgbColor: FormGroup<RgbColorForm>;
    orientation: FormControl<string | null>;
    minWidth: FormControl<number | null>;
    minHeight: FormControl<number | null>;
    uploadDateRange: FormControl<Date[] | null>;
    captureDateRange: FormControl<Date[] | null>;
    country: FormControl<string | null>;
    cameraModel: FormControl<string | null>;
    fileFormat: FormControl<string | null>;
}

export interface FilterFormValue {
    rgbColor?: {
        r?: number | null;
        g?: number | null;
        b?: number | null;
    } | null;
    orientation?: string | null;
    minWidth?: number | null;
    minHeight?: number | null;
    uploadDateRange?: (Date | null)[] | null;
    captureDateRange?: (Date | null)[] | null;
    country?: string | null;
    cameraModel?: string | null;
    fileFormat?: string | null;
}