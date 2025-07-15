import { Visibility } from "@shared/enums/visibility.enum";

export interface PhotoUploadForm {
    file: File;
    title: string;
    visibility: Visibility;
    description?: string;
    location?: string;
    cameraModel?: string;
    captureDate?: Date;
}