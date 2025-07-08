import { inject, Injectable } from "@angular/core";
import { PhotoApiService, PhotoSearchResponse } from "@core/api";
import { map, Observable } from "rxjs";
import { PhotoSearchResponseClientModel } from "./models/photo/photo-search-response.client-model";
import { RGBVectorClientModel } from "./models/photo/rgb-vector.client-model";

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
}