import { FormControl } from "@angular/forms";
import { VisibilityClientEnum } from "@core/clients/enums/visibility.client-enum";

export interface PhotoUploadFormViewModel {
    file: FormControl<File | null>;
    title: FormControl<string | null>;
    visibility: FormControl<VisibilityClientEnum | null>;
    description: FormControl<string | null>;
    location: FormControl<string | null>;
    cameraModel: FormControl<string | null>;
    captureDate: FormControl<Date | null>;
};