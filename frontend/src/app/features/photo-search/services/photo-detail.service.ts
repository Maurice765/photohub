import { Injectable, inject } from "@angular/core";
import { PhotoGetResponseClientModel } from "@core/clientModels/photo/photo-get-response.client-model";
import { PhotoClient } from "@core/clients/photo.client";
import { Observable, map } from "rxjs";
import { PhotoDetailViewModel } from "../models/photo-detail.view-model";
import { environment } from "@environments/environment";

@Injectable({
    providedIn: 'root'
})
export class PhotoDetailService {
    private photoClient = inject(PhotoClient);

    getPhotoDetail(photoId: number): Observable<PhotoDetailViewModel> {
        return this.photoClient.get(photoId).pipe(
            map((response: PhotoGetResponseClientModel) => {
                const viewModel = new PhotoDetailViewModel(response);
                viewModel.imageUrl = environment.apiUrl + response.imageUrl;
                return viewModel;
            })
        );
    }
}