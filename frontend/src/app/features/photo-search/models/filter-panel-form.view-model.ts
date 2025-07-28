import { FormControl } from '@angular/forms';
import { FileFormatClientEnum } from '@core/clientEnums/file-format.client-enum';
import { OrientationClientEnum } from '@core/clientEnums/orientation.client-enum';
import { RGBColor } from '@shared/models/rgb-color.interface';

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