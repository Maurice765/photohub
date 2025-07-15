import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'photo-search',
        loadChildren: () =>
        import('./features/photo-search/photo-search.routes').then(m => m.PHOTO_SEARCH_ROUTES),
    },
    {
        path: 'photo-upload',
        outlet: 'dialog',
        loadChildren: () =>
        import('./features/photo-upload/photo-upload.routes').then(m => m.PHOTO_UPLOAD_ROUTES),
    },
    {
        path: '**',
        redirectTo: 'photo-search',
    }
];
