import { PhotoSearchResponse } from "@core/api";
import { PhotoSearchResultItemClientModel } from "./photo-search-result-item.client-model";

export class PhotoSearchResponseClientModel {
    public results: PhotoSearchResultItemClientModel[];

    constructor(apiModel: PhotoSearchResponse) {
        this.results = apiModel.results.map(item => new PhotoSearchResultItemClientModel(item));
    }
}