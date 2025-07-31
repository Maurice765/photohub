import { FileFormatClientEnum } from "@core/clientEnums/file-format.client-enum";
import { OrientationClientEnum } from "@core/clientEnums/orientation.client-enum";
import { DateRangeClientModel } from "./date-range.client-model";
import { RGBColorClientModel } from "./rgb-color.client-model";
import { PhotoSearchViewModel } from "@features/photo-search/models/photo-search.view-model";
import { PhotoSearchRequest } from "@core/api";

export class PhotoSearchRequestClientModel { 
    public query?: string;
    public categoryId?: number;
    public rgbColor?: RGBColorClientModel;
    public minHeight?: number;
    public minWidth?: number;
    public orientation?: OrientationClientEnum;
    public fileFormat?: FileFormatClientEnum;
    public location?: string;
    public cameraModel?: string;
    public uploadDateRange?: DateRangeClientModel;
    public captureDateRange?: DateRangeClientModel;
    public useHistogram?: boolean;
    public limit?: number;
    public offset?: number;

    constructor(viewModel: PhotoSearchViewModel) {
        this.query = viewModel.query;
        this.categoryId = viewModel.categoryId;
        if (viewModel.rgbColor) {
            this.rgbColor = new RGBColorClientModel(viewModel.rgbColor);
        }
        this.minHeight = viewModel.minHeight;
        this.minWidth = viewModel.minWidth;
        this.orientation = viewModel.orientation;
        this.fileFormat = viewModel.fileFormat;
        this.location = viewModel.location;
        this.cameraModel = viewModel.cameraModel;
        if (viewModel.uploadDateStart && viewModel.uploadDateEnd) {
            this.uploadDateRange = new DateRangeClientModel(viewModel.uploadDateStart, viewModel.uploadDateEnd);
        }
        if (viewModel.captureDateStart && viewModel.captureDateEnd) {
            this.captureDateRange = new DateRangeClientModel(viewModel.captureDateStart, viewModel.captureDateEnd);
        }
        this.useHistogram = viewModel.useHistogram;
        this.limit = viewModel.limit;
        this.offset = viewModel.offset;
    }

    public toApiModel(): PhotoSearchRequest {
        return {
            query: this.query,
            category_id: this.categoryId,
            rgbColor: this.rgbColor?.toApiModel(),
            minHeight: this.minHeight,
            minWidth: this.minWidth,
            orientation: this.orientation,
            fileFormat: this.fileFormat,
            location: this.location,
            cameraModel: this.cameraModel,
            uploadDate: this.uploadDateRange?.toApiModel(),
            captureDate: this.captureDateRange?.toApiModel(),
            useHistogram: this.useHistogram,
            limit: this.limit,
            offset: this.offset
        };
    }
}