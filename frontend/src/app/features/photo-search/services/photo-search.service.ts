import { inject, Injectable } from '@angular/core';
import { PhotoSearchResponseClientModel } from '@core/clientModels/photo/photo-search-response.client-model';
import { PhotoSearchResultItemClientModel } from '@core/clientModels/photo/photo-search-result-item.client-model';
import { PhotoClient } from '@core/clients/photo.client';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';
import { PhotoGridItemViewModel } from '../models/photo-grid-item.view-model';
import { PhotoGridViewModel } from '../models/photo-grid.view-model';
import { PhotoSearchViewModel } from '../models/photo-search.view-model';
import { PhotoSearchRequestClientModel } from '@core/clientModels/photo/photo-search-request.client-model';

@Injectable({
    providedIn: 'root'
})
export class PhotoSearchService {
    private photoClient = inject(PhotoClient);

    searchPhotos(viewModel: PhotoSearchViewModel): Observable<PhotoGridViewModel> {
        const clientModel = new PhotoSearchRequestClientModel(viewModel);

        return this.photoClient.searchByColor(clientModel).pipe(
            map((response: PhotoSearchResponseClientModel) => {
                const items = response.results.map((item: PhotoSearchResultItemClientModel) => {
                    const viewModel = new PhotoGridItemViewModel(item);
                    viewModel.preview_url = environment.apiUrl + item.previewUrl;
                    return viewModel;
                })

                return new PhotoGridViewModel(items);
            })
        );
    }
}
