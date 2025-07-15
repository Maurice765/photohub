import { FilterFormValue } from "./filter-form.model";
import { RGBVectorViewModel } from "./rgb-vector.view-model";

export class FilterPanelViewModel {
    color?: RGBVectorViewModel;
    orientation?: string;
    minWidth?: number;
    minHeight?: number;
    location?: string;
    cameraModel?: string;
    fileFormat?: string;
    uploadDateStart?: Date;
    uploadDateEnd?: Date;
    captureDateStart?: Date;
    captureDateEnd?: Date;

    constructor(filterForm: FilterFormValue) {

        if (filterForm?.rgbColor?.r != null && filterForm?.rgbColor?.g != null && filterForm?.rgbColor?.b != null) {
            this.color = new RGBVectorViewModel(filterForm.rgbColor.r, filterForm.rgbColor.g, filterForm.rgbColor.b);
        }

        this.orientation = filterForm?.orientation ?? undefined;
        this.minWidth = filterForm?.minWidth ?? undefined;
        this.minHeight = filterForm?.minHeight ?? undefined;
        this.location = filterForm?.location ?? undefined;
        this.cameraModel = filterForm?.cameraModel ?? undefined;
        this.fileFormat = filterForm?.fileFormat ?? undefined;
        this.uploadDateStart = filterForm.uploadDateRange?.[0] ?? undefined;
        this.uploadDateEnd = filterForm.uploadDateRange?.[1] ?? undefined;
        this.captureDateStart = filterForm.captureDateRange?.[0] ?? undefined
        this.captureDateEnd = filterForm.captureDateRange?.[1] ?? undefined;
    }
}