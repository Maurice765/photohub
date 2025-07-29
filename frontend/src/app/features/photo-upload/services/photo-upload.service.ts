import { inject, Injectable } from '@angular/core';
import { PhotoClient } from '@core/clients/photo.client';
import { map, Observable } from 'rxjs';
import { PhotoUploadResponseViewModel } from '../models/photo-upload-response.view-model';
import { PhotoUploadViewModel } from '../models/photo-upload.view-model';
import { PhotoUploadRequestClientModel } from '@core/clientModels/photo/photo-upload-request.client-model';

@Injectable({
    providedIn: 'root'
})
export class PhotoUploadService {
    private photoClient = inject(PhotoClient);

    uploadPhoto(viewModel: PhotoUploadViewModel): Observable<PhotoUploadResponseViewModel> {
        const clientModel = new PhotoUploadRequestClientModel(viewModel);

        return this.photoClient.upload(clientModel).pipe(
            map((response) => new PhotoUploadResponseViewModel(response))
        );
    }
}
