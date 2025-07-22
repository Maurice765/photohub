import { PhotoGridItemViewModel } from "./photo-grid-item.view-model";

export class PhotoGridViewModel {
    public items: PhotoGridItemViewModel[];

    constructor(items: PhotoGridItemViewModel[]) {
        this.items = items;
    }
}