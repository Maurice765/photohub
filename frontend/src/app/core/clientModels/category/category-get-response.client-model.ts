import { CategoryGetResponse } from "@core/api";

export class CategoryGetResponseClientModel {
    public id: number;
    public name: string;
    public description: string;
    public parentId?: number | null;

    constructor(apiModel: CategoryGetResponse) {
        this.id = apiModel.id;
        this.name = apiModel.name;
        this.description = apiModel.description;
        this.parentId = apiModel.parent_id;
    }
}