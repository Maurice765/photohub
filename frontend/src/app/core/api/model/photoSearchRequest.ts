/**
 * FastAPI Photohub Service
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { DateRange } from './dateRange';
import { FileFormatEnum } from './fileFormatEnum';
import { OrientationEnum } from './orientationEnum';
import { RGBColor } from './rGBColor';


export interface PhotoSearchRequest { 
    query?: string | null;
    rgbColor?: RGBColor | null;
    minHeight?: number | null;
    minWidth?: number | null;
    orientation?: OrientationEnum | null;
    fileFormat?: FileFormatEnum | null;
    location?: string | null;
    cameraModel?: string | null;
    uploadDate?: DateRange | null;
    captureDate?: DateRange | null;
    limit?: number | null;
    offset?: number | null;
}
export namespace PhotoSearchRequest {
}


