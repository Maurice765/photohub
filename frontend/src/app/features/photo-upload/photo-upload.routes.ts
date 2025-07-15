import { Routes } from '@angular/router';
import { PhotoUploadDialog } from './dialogs/photo-upload/photo-upload.dialog';

export const PHOTO_UPLOAD_ROUTES: Routes = [
    {
        path: '',
        component: PhotoUploadDialog,
    },
];