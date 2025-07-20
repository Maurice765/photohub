import { FileFormatClientEnum } from "@core/clients/enums/file-format.client-enum";
import { OrientationClientEnum } from "@core/clients/enums/orientation.client-enum";
import { DateRangeClientModel } from "./date-range.client-model";
import { RGBColorClientModel } from "./rgb-vector.client-model";

export interface PhotoSearchRequestClientModel { 
    searchInput?: string;
    rgbColor?: RGBColorClientModel;
    minHeight?: number;
    minWidth?: number;
    orientation?: OrientationClientEnum;
    fileFormat?: FileFormatClientEnum;
    location?: string;
    cameraModel?: string;
    uploadDateRange?: DateRangeClientModel;
    captureDateRange?: DateRangeClientModel;
    limit?: number;
    offset?: number;
}