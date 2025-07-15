import { PhotoResponseClientModel } from "@core/clients/models/photo/photo-upload-response.client-model";

export class PhotoUploadResponseViewModel {
    public contentId: number;
    public photoId: number;
    public filename: string;

    constructor(clientModel: PhotoResponseClientModel) {
        this.contentId = clientModel.content_id;
        this.photoId = clientModel.photo_id;
        this.filename = clientModel.filename;
    }
}