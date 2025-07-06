import { PhotoSearchResultItemClientModel } from "@core/clients/models/photo/photo-search-result-item.client-model";

export class PhotoSearchResultItemViewModel {
  id: number;
  distance: number;
  imageUrl: string;

  constructor(clientModel: PhotoSearchResultItemClientModel) {
    this.id = clientModel.photo_id;
    this.distance = clientModel.distance;
    this.imageUrl = clientModel.image_url;
  }
}