import { PhotoSearchResultItemClientModel } from "@core/clients/models/photo/photo-search-result-item.client-model";

export class PhotoGridItemViewModel {
    public id: number;
    public score: number;
    public preview_url: string;

    constructor(clientModel: PhotoSearchResultItemClientModel) {
        this.id = clientModel.photo_id;
        this.score = clientModel.score;
        this.preview_url = clientModel.preview_url;
    }
}