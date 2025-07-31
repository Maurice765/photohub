import { OrientationClientEnum } from "@core/clientEnums/orientation.client-enum";
import { FilterPanelFormViewModel } from "./filter-panel-form.view-model";
import { RGBColorViewModel } from "./rgb-color.view-model";
import { FileFormatClientEnum } from "@core/clientEnums/file-format.client-enum";
import { FormGroupValue } from "@shared/types/form-group-value.type";

type FilterPanelFormValue = FormGroupValue<FilterPanelFormViewModel>;

export class FilterPanelViewModel {
    public rgbColor?: RGBColorViewModel;
    public minWidth?: number;
    public minHeight?: number;
    public orientation?: OrientationClientEnum;
    public fileFormat?: FileFormatClientEnum;
    public location?: string;
    public cameraModel?: string;
    public uploadDateStart?: Date;
    public uploadDateEnd?: Date;
    public captureDateStart?: Date;
    public captureDateEnd?: Date;
    public useHistogram?: boolean;

    constructor(form: FilterPanelFormValue) {

        if (form?.rgbColor?.r != null && form?.rgbColor?.g != null && form?.rgbColor?.b != null) {
            this.rgbColor = new RGBColorViewModel(form.rgbColor.r, form.rgbColor.g, form.rgbColor.b);
        }

        this.minWidth = form?.minWidth ?? undefined;
        this.minHeight = form?.minHeight ?? undefined;
        this.orientation = form?.orientation ?? undefined;
        this.fileFormat = form?.fileFormat ?? undefined;
        this.location = form?.location ?? undefined;
        this.cameraModel = form?.cameraModel ?? undefined;
        this.uploadDateStart = form.uploadDateRange?.[0] ?? undefined;
        this.uploadDateEnd = form.uploadDateRange?.[1] ?? undefined;
        this.captureDateStart = form.captureDateRange?.[0] ?? undefined;
        this.captureDateEnd = form.captureDateRange?.[1] ?? undefined;
        this.useHistogram = form?.useHistogram ?? undefined;
    }
}