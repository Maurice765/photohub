import { inject, Injectable } from "@angular/core";
import { CategoryApiService, CategoryGetResponse } from "@core/api";
import { CategoryGetResponseClientModel } from "@core/clientModels/category/category-get-response.client-model";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CategoryClient {
    private apiService = inject(CategoryApiService);

    public getCategories(): Observable<CategoryGetResponseClientModel[]> {
        return this.apiService.getAllCategories().pipe(
            map((categories: CategoryGetResponse[]) => {
                return categories.map((category: CategoryGetResponse) => {
                    return new CategoryGetResponseClientModel(category);
                });
            })
        );
    }

    public getCategory(id: number): Observable<CategoryGetResponseClientModel> {
        return this.apiService.getCategory(id).pipe(
            map((category: CategoryGetResponse) => {
                return new CategoryGetResponseClientModel(category);
            })
        );
    }
}