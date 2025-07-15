import { VisibilityClientEnum } from "@core/clients/enums/visibility.client-enum";

export interface PhotoUploadClientModel {
    title: string;
    visibility: VisibilityClientEnum;
    file: Blob;
    description?: string;
    location?: string;
    captureDate?: string;
    cameraModel?: string;
}