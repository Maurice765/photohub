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

    public searchByColor(requestModel: PhotoSearchRequestClientModel): Observable<PhotoSearchResponseClientModel> {
        const apiModel = requestModel.toApiModel();
        
        return this.apiService.searchByColor(apiModel).pipe(
            map((response: PhotoSearchResponse) => {
                return new PhotoSearchResponseClientModel(response);
            })
        );
    }

    public uploadPhoto(requestModel: PhotoUploadRequestClientModel): Observable<PhotoUploadResponseClientModel> {
        return this.apiService.uploadPhoto(
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