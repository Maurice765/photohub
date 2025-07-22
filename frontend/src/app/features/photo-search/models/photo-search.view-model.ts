import { FileFormatClientEnum } from "@core/clients/enums/file-format.client-enum";
import { OrientationClientEnum } from "@core/clients/enums/orientation.client-enum";
import { DateRangeClientModel } from "@core/clients/models/photo/date-range.client-model";
import { PhotoSearchRequestClientModel } from "@core/clients/models/photo/photo-search-request.client-model";
import { RGBColorViewModel } from "./rgb-color.view-model";
import { FilterPanelViewModel } from "./filter-panel.view-model";

export class PhotoSearchViewModel {
    public query?: string;
    public categorie?: string;
    public rgbColor?: RGBColorViewModel;
    public minHeight?: number;
    public minWidth?: number;
    public orientation?: OrientationClientEnum;
    public fileFormat?: FileFormatClientEnum;
    public location?: string;
    public cameraModel?: string;
    public uploadDateStart?: Date;
    public uploadDateEnd?: Date;
    public captureDateStart?: Date;
    public captureDateEnd?: Date;
    public limit?: number;
    public offset?: number;

    constructor(filter?: FilterPanelViewModel, category?: string, query?: string) {
        this.query = query?.trim() ? query : undefined;
        this.categorie = category?.trim() ? category : undefined;;
        if (filter) {
            this.rgbColor = filter.rgbColor;
            this.minHeight = filter.minHeight;
            this.minWidth = filter.minWidth;
            this.orientation = filter.orientation;
            this.fileFormat = filter.fileFormat;
            this.location = filter.location;
            this.cameraModel = filter.cameraModel;
            this.uploadDateStart = filter.uploadDateStart;
            this.uploadDateEnd = filter.uploadDateEnd;
            this.captureDateStart = filter.captureDateStart;
            this.captureDateEnd = filter.captureDateEnd;
        }
    }

    public toClientModel(): PhotoSearchRequestClientModel {
        return {
            searchInput: this.query,
            rgbColor: this.rgbColor?.toClientModel() ?? undefined,
            minHeight: this.minHeight,
            minWidth: this.minWidth,
            orientation: this.orientation,
            fileFormat: this.fileFormat,
            location: this.location,
            cameraModel: this.cameraModel,
            uploadDateRange: this.dateRangeToClientModel(this.uploadDateStart, this.uploadDateEnd),
            captureDateRange: this.dateRangeToClientModel(this.captureDateStart, this.captureDateEnd),
            limit: this.limit,
            offset: this.offset
        };
    }

    private dateRangeToClientModel(startDate?: Date, endDate?: Date): DateRangeClientModel | undefined {
        if (!startDate || !endDate) return undefined;

        return {
            start: startDate,
            end: endDate
        };
    }
}