import { PhotoUploadResponse } from "@core/api";

export class PhotoUploadResponseClientModel {
    public contentId: number;
    public photoId: number;
    public filename?: string | null;

    constructor(apiModel: PhotoUploadResponse) {
        this.contentId = apiModel.content_id;
        this.photoId = apiModel.photo_id;
        this.filename = apiModel.filename;
    }
}