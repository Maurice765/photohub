import { VisibilityClientEnum } from "@core/clients/enums/visibility.client-enum";
import { PhotoUploadViewModel } from "@features/photo-upload/models/photo-upload.view-model";

export class PhotoUploadRequestClientModel {
    public title: string;
    public visibility: VisibilityClientEnum;
    public file: Blob;
    public description?: string;
    public location?: string;
    public captureDate?: string;
    public cameraModel?: string;

    constructor(viewModel: PhotoUploadViewModel) {
        this.file = viewModel.file;
        this.title = viewModel.title;
        this.visibility = viewModel.visibility;
        this.description = viewModel.description;
        this.location = viewModel.location;
        this.cameraModel = viewModel.cameraModel;
        this.captureDate = viewModel.captureDate?.toISOString();
    }
}