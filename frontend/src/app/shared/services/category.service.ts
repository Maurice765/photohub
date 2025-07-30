import { inject, Injectable } from '@angular/core';
import { CategoryClient } from '@core/clients/category.client';
import { SelectorItem } from '@shared/models/selector-item.interface';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private categoryClient = inject(CategoryClient);

    public getCategorySelectorItems(): Observable<SelectorItem[]> {
        return this.categoryClient.getCategories().pipe(
            map(categories => categories.map(category => ({
                key: category.id,
                name: category.name
            })))
        );
    }
}
