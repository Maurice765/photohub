import { VisibilityClientEnum } from "@core/clients/enums/visibility.client-enum";

export interface PhotoUploadRequestClientModel {
    title: string;
    visibility: VisibilityClientEnum;
    file: Blob;
    description?: string;
    location?: string;
    captureDate?: string;
    cameraModel?: string;
}