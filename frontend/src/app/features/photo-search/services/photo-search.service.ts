import { inject, Injectable } from '@angular/core';
import { PhotoSearchResponseClientModel } from '@core/clients/models/photo/photo-search-response.client-model';
import { PhotoSearchResultItemClientModel } from '@core/clients/models/photo/photo-search-result-item.client-model';
import { PhotoClient } from '@core/clients/photo.client';
import { map, Observable } from 'rxjs';
import { PhotoSearchResultItemViewModel } from '../models/photo-search-result-item.view-model';
import { RGBVectorViewModel } from '../models/rgb-vector.view-model';

@Injectable({
    providedIn: 'root'
})
export class PhotoSearchService {
    private photoClient = inject(PhotoClient);

    searchPhotos(rgbVector: RGBVectorViewModel, limit?: number): Observable<PhotoSearchResultItemViewModel[]> {
        const rgbVectorClientModel = rgbVector.toClientModel();

        return this.photoClient.searchByColor(rgbVectorClientModel, limit).pipe(
            map((response: PhotoSearchResponseClientModel) => {
                return response.results.map((item: PhotoSearchResultItemClientModel) => {
                    return new PhotoSearchResultItemViewModel(item);
                })
            })
        );
    }
}
