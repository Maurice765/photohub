import { PhotoUploadResponseClientModel } from "@core/clients/models/photo/photo-upload-response.client-model";

export class PhotoUploadResponseViewModel {
    public contentId: number;
    public photoId: number;
    public filename: string;

    constructor(clientModel: PhotoUploadResponseClientModel) {
        this.contentId = clientModel.contentId;
        this.photoId = clientModel.photoId;
        this.filename = clientModel.filename || '';
    }
}