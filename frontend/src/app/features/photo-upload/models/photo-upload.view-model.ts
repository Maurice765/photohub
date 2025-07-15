import { Visibility } from "@shared/enums/visibility.enum";
import { PhotoUploadForm } from "./photo-upload-form.view-model";
import { PhotoUploadClientModel } from "@core/clients/models/photo/photo-upload.client-model";
import { VisibilityClientEnum } from "@core/clients/enums/visibility.client-enum";

export class PhotoUploadViewModel {
    public file: File;
    public title: string;
    public visibility: Visibility;
    public description?: string;
    public location?: string;
    public cameraModel?: string;
    public captureDate?: Date; 

    constructor(uploadForm: PhotoUploadForm) {
        this.file = uploadForm.file;
        this.title = uploadForm.title;
        this.visibility = uploadForm.visibility;
        this.description = uploadForm.description;
        this.location = uploadForm.location;
        this.cameraModel = uploadForm.cameraModel;
        this.captureDate = uploadForm.captureDate;
    }

    public toClientModel(): PhotoUploadClientModel {
        return {
            file: this.file,
            title: this.title,
            visibility: this.visibility as unknown as VisibilityClientEnum,
            description: this.description,
            location: this.location,
            cameraModel: this.cameraModel,
            captureDate: this.captureDate?.toISOString()
        };
    }
}