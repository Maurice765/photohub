import { FormControl, FormGroup } from '@angular/forms';
import { RGBColor } from '@shared/models/rgbColor.interface';

export interface FilterFormModel {
    rgbColor: FormControl<RGBColor | null>;
    orientation: FormControl<string | null>;
    minWidth: FormControl<number | null>;
    minHeight: FormControl<number | null>;
    uploadDateRange: FormControl<Date[] | null>;
    captureDateRange: FormControl<Date[] | null>;
    location: FormControl<string | null>;
    cameraModel: FormControl<string | null>;
    fileFormat: FormControl<string | null>;
}

export interface FilterFormValue {
    rgbColor?: RGBColor | null;
    orientation?: string | null;
    minWidth?: number | null;
    minHeight?: number | null;
    uploadDateRange?: (Date | null)[] | null;
    captureDateRange?: (Date | null)[] | null;
    location?: string | null;
    cameraModel?: string | null;
    fileFormat?: string | null;
}