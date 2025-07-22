import { FormControl } from '@angular/forms';
import { FileFormatClientEnum } from '@core/clients/enums/file-format.client-enum';
import { OrientationClientEnum } from '@core/clients/enums/orientation.client-enum';
import { RGBColor } from '@shared/models/rgbColor.interface';

export interface FilterPanelFormViewModel {
    rgbColor: FormControl<RGBColor | null>;
    minWidth: FormControl<number | null>;
    minHeight: FormControl<number | null>;
    orientation: FormControl<OrientationClientEnum | null>;
    fileFormat: FormControl<FileFormatClientEnum | null>;
    location: FormControl<string | null>;
    cameraModel: FormControl<string | null>;
    uploadDateRange: FormControl<Date[] | null>;
    captureDateRange: FormControl<Date[] | null>;
}