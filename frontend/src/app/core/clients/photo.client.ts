import { inject, Injectable } from "@angular/core";
import { PhotoApiService, PhotoGetResponse, PhotoSearchResponse, PhotoUploadResponse } from "@core/api";
import { map, Observable } from "rxjs";
import { PhotoSearchRequestClientModel } from "../clientModels/photo/photo-search-request.client-model";
import { PhotoSearchResponseClientModel } from "../clientModels/photo/photo-search-response.client-model";
import { PhotoUploadRequestClientModel } from "../clientModels/photo/photo-upload-request.client-model";
import { PhotoUploadResponseClientModel } from "../clientModels/photo/photo-upload-response.client-model";
import { PhotoGetResponseClientModel } from "@core/clientModels/photo/photo-get-response.client-model";

@Injectable({
    providedIn: 'root'
})
export class PhotoClient {
    private apiService = inject(PhotoApiService);

    public get(photoId: number): Observable<PhotoGetResponseClientModel> {
        return this.apiService.getPhoto(photoId).pipe(
            map((response: PhotoGetResponse) => {
                return new PhotoGetResponseClientModel(response);
            })
        );
    }

    public search(requestModel: PhotoSearchRequestClientModel): Observable<PhotoSearchResponseClientModel> {
        const apiModel = requestModel.toApiModel();
        
        return this.apiService.search(apiModel).pipe(
            map((response: PhotoSearchResponse) => {
                return new PhotoSearchResponseClientModel(response);
            })
        );
    }

    public searchByPhoto(file: File): Observable<PhotoSearchResponseClientModel> {
        return this.apiService.searchByPhoto(file).pipe(
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