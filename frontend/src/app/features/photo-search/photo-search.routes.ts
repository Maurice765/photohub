import { Routes } from '@angular/router';
import { PhotoSearchPage } from './pages/photo-search/photo-search.page';
import { SearchByPhotoPage } from './pages/search-by-photo/search-by-photo.page';


export const PHOTO_SEARCH_ROUTES: Routes = [
    {
        path: 'photo',
        component: PhotoSearchPage,
    },
    {
        path: 'by-photo',
        component: SearchByPhotoPage,
    },
];