import { PhotoGetResponse } from "@core/api";
import { FileFormatClientEnum } from "@core/clientEnums/file-format.client-enum";
import { OrientationClientEnum } from "@core/clientEnums/orientation.client-enum";
import { VisibilityClientEnum } from "@core/clientEnums/visibility.client-enum";

export class PhotoGetResponseClientModel {
    public photoId: number;
    public userId: number;
    public username: string;
    public title: string;
    public description?: string;
    public categoryId?: number;
    public categoryName?: string;
    public location?: string;
    public cameraModel?: string;
    public captureDate?: string;
    public uploadDate: string;
    public visibility: VisibilityClientEnum;
    public orientation: OrientationClientEnum;
    public fileFormat: FileFormatClientEnum;
    public fileSize: number;
    public views: number;
    public width: number;
    public height: number;
    public imageUrl: string;

    constructor(apiModel: PhotoGetResponse) {
        this.photoId = apiModel.photo_id;
        this.userId = apiModel.user_id;
        this.username = apiModel.username;
        this.title = apiModel.title;
        this.description = apiModel.description ?? undefined;
        this.categoryId = apiModel.category_id ?? undefined;
        this.categoryName = apiModel.category_name ?? undefined;
        this.location = apiModel.location ?? undefined;
        this.cameraModel = apiModel.camera_model ?? undefined;
        this.captureDate = apiModel.capture_date ?? undefined;
        this.uploadDate = apiModel.upload_date;
        this.visibility = apiModel.visibility as VisibilityClientEnum;
        this.orientation = apiModel.orientation as OrientationClientEnum;
        this.fileFormat = apiModel.file_format as FileFormatClientEnum;
        this.fileSize = apiModel.file_size;
        this.views = apiModel.views;
        this.width = apiModel.width;
        this.height = apiModel.height;
        this.imageUrl = apiModel.image_url;
    }
}