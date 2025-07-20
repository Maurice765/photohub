import { FileFormatClientEnum } from "@core/clients/enums/file-format.client-enum";
import { OrientationClientEnum } from "@core/clients/enums/orientation.client-enum";
import { DateRangeClientModel } from "@core/clients/models/photo/date-range.client-model";
import { PhotoSearchRequestClientModel } from "@core/clients/models/photo/photo-search-request.client-model";
import { RGBColorViewModel } from "./rgb-color.view-model";

export class PhotoSearchViewModel {
    public searchInput?: string;
    public RgbColor?: RGBColorViewModel;
    public minHeight?: number;
    public minWidth?: number;
    public Orientation?: OrientationClientEnum;
    public FileFormat?: FileFormatClientEnum;
    public Location?: string;
    public CameraModell?: string;
    public UploadDateRange?: Date[];
    public CaptureDateRange?: Date[];
    public limit?: number;
    public offset?: number;

    constructor() {

    }

    public toClientModel(): PhotoSearchRequestClientModel {
        return {
            searchInput: this.searchInput,
            rgbColor: this.RgbColor?.toClientModel() ?? undefined,
            minHeight: this.minHeight,
            minWidth: this.minWidth,
            orientation: this.Orientation,
            fileFormat: this.FileFormat,
            location: this.Location,
            cameraModel: this.CameraModell,
            uploadDateRange: this.dateRangeToClientModel(this.UploadDateRange),
            captureDateRange: this.dateRangeToClientModel(this.CaptureDateRange),
            limit: this.limit,
            offset: this.offset
        };
    }

    private dateRangeToClientModel(dateRange?: Date[]): DateRangeClientModel | undefined {
        if (!dateRange || dateRange.length !== 2) return undefined;

        return {
            start: dateRange[0],
            end: dateRange[1]
        };
    }
}