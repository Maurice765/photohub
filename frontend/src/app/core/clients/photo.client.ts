import { inject, Injectable } from "@angular/core";
import { PhotoApiService, PhotoResponse, PhotoSearchResponse } from "@core/api";
import { map, Observable } from "rxjs";
import { PhotoSearchResponseClientModel } from "./models/photo/photo-search-response.client-model";
import { RGBVectorClientModel } from "./models/photo/rgb-vector.client-model";
import { PhotoUploadClientModel } from "./models/photo/photo-upload.client-model";
import { PhotoResponseClientModel } from "./models/photo/photo-upload-response.client-model";

@Injectable({
    providedIn: 'root'
})
export class PhotoClient {
    private apiService = inject(PhotoApiService);
    
    public searchByColor(rgbVector: RGBVectorClientModel, limit?: number): Observable<PhotoSearchResponseClientModel> {
        return this.apiService.searchByColor(rgbVector, limit).pipe(
            map((response: PhotoSearchResponse) => {
                return response as PhotoSearchResponseClientModel;
            })
        );
    }

    public uploadPhoto(photoUpload: PhotoUploadClientModel) {
        return this.apiService.uploadPhoto(
            photoUpload.title,
            photoUpload.visibility,
            photoUpload.file,
            photoUpload.description,
            photoUpload.location,
            photoUpload.captureDate,
            photoUpload.cameraModel
        ).pipe(
            map((response: PhotoResponse) => {
                return response as PhotoResponseClientModel;
            })
        );  
    }
}