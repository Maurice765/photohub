import { inject, Injectable } from "@angular/core";
import { PhotoApiService, PhotoSearchResponse, PhotoUploadResponse } from "@core/api";
import { map, Observable } from "rxjs";
import { PhotoSearchRequestClientModel } from "../clientModels/photo/photo-search-request.client-model";
import { PhotoSearchResponseClientModel } from "../clientModels/photo/photo-search-response.client-model";
import { PhotoUploadRequestClientModel } from "../clientModels/photo/photo-upload-request.client-model";
import { PhotoUploadResponseClientModel } from "../clientModels/photo/photo-upload-response.client-model";

@Injectable({
    providedIn: 'root'
})
export class PhotoClient {
    private apiService = inject(PhotoApiService);

    public search(requestModel: PhotoSearchRequestClientModel): Observable<PhotoSearchResponseClientModel> {
        const apiModel = requestModel.toApiModel();
        
        return this.apiService.search(apiModel).pipe(
            map((response: PhotoSearchResponse) => {
                return new PhotoSearchResponseClientModel(response);
            })
        );
    }

    public upload(requestModel: PhotoUploadRequestClientModel): Observable<PhotoUploadResponseClientModel> {
        return this.apiService.upload(
            requestModel.title,
            requestModel.visibility,
            requestModel.file,
            requestModel.categoryId,
            requestModel.description,
            requestModel.location,
            requestModel.captureDate,
            requestModel.cameraModel
        ).pipe(
            map((response: PhotoUploadResponse) => {
                return new PhotoUploadResponseClientModel(response);
            })
        );  
    }
}