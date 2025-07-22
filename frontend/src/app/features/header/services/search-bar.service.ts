import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { SearchBarViewModel } from "../models/search-bar.view-model";

@Injectable({
    providedIn: "root",
})
export class SearchBarService {
    private readonly _searchTrigger$ = new BehaviorSubject<SearchBarViewModel | null>(null);
    public readonly searchTrigger$ = this._searchTrigger$.asObservable();

    public triggerSearch(query: string, category: string): void {
        this._searchTrigger$.next({ query, category });
    }
}