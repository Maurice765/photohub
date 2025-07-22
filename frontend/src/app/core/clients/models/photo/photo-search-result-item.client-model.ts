import { PhotoSearchResultItem } from "@core/api";

export class PhotoSearchResultItemClientModel {
    photoId: number;
    score: number;
    previewUrl: string;

    constructor(apiModel: PhotoSearchResultItem) {
        this.photoId = apiModel.photo_id;
        this.score = apiModel.score;
        this.previewUrl = apiModel.preview_url;
    }
}