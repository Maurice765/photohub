import { inject, Injectable } from "@angular/core";
import { PhotoApiService, PhotoUploadResponse, PhotoSearchRequest, PhotoSearchResponse } from "@core/api";
import { map, Observable } from "rxjs";
import { PhotoSearchResponseClientModel } from "./models/photo/photo-search-response.client-model";
import { PhotoUploadRequestClientModel } from "./models/photo/photo-upload-request.client-model";
import { PhotoUploadResponseClientModel } from "./models/photo/photo-upload-response.client-model";
import { PhotoSearchRequestClientModel } from "./models/photo/photo-search-request.client-model";

@Injectable({
    providedIn: 'root'
})
export class PhotoClient {
    private apiService = inject(PhotoApiService);

    public searchByColor(requestModel: PhotoSearchRequestClientModel): Observable<PhotoSearchResponseClientModel> {
        let apiModel = requestModel.toApiModel();
        
        return this.apiService.searchByColor(apiModel).pipe(
            map((response: PhotoSearchResponse) => {
                return response as PhotoSearchResponseClientModel;
            })
        );
    }

    public uploadPhoto(requestModel: PhotoUploadRequestClientModel): Observable<PhotoUploadResponseClientModel> {
        return this.apiService.uploadPhoto(
            requestModel.title,
            requestModel.visibility,
            requestModel.file,
            requestModel.description,
            requestModel.location,
            requestModel.captureDate,
            requestModel.cameraModel
        ).pipe(
            map((response: PhotoUploadResponse) => {
                return response as PhotoUploadResponseClientModel;
            })
        );  
    }
}