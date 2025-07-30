import { FileFormatClientEnum } from "@core/clientEnums/file-format.client-enum";
import { OrientationClientEnum } from "@core/clientEnums/orientation.client-enum";
import { VisibilityClientEnum } from "@core/clientEnums/visibility.client-enum";
import { PhotoGetResponseClientModel } from "@core/clientModels/photo/photo-get-response.client-model";

export class PhotoDetailViewModel {
    public photoId?: number;
    public userId?: number;
    public title?: string;
    public description?: string;
    public categoryId?: number;
    public location?: string;
    public cameraModel?: string;
    public captureDate?: string;
    public uploadDate?: string;
    public visibility?: VisibilityClientEnum;
    public orientation?: OrientationClientEnum;
    public fileFormat?: FileFormatClientEnum;
    public fileSize?: number;
    public views?: number;
    public width?: number;
    public height?: number;
    public imageUrl?: string;

    constructor(clientModel?: PhotoGetResponseClientModel) {
        if (clientModel) {
            this.photoId = clientModel.photoId;
            this.userId = clientModel.userId;
            this.title = clientModel.title;
            this.description = clientModel.description;
            this.categoryId = clientModel.categoryId;
            this.location = clientModel.location;
            this.cameraModel = clientModel.cameraModel;
            this.captureDate = clientModel.captureDate;
            this.uploadDate = clientModel.uploadDate;
            this.visibility = clientModel.visibility;
            this.orientation = clientModel.orientation;
            this.fileFormat = clientModel.fileFormat;
            this.fileSize = clientModel.fileSize;
            this.views = clientModel.views;
            this.width = clientModel.width;
            this.height = clientModel.height;
            this.imageUrl = clientModel.imageUrl;
        }
    }
}