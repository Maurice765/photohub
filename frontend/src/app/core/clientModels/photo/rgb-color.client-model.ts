import { RGBColor } from "@core/api";
import { RGBColorViewModel } from "@features/photo-search/models/rgb-color.view-model";

export class RGBColorClientModel {
    public r: number;
    public g: number;
    public b: number;

    constructor(viewModel: RGBColorViewModel) {
        this.r = viewModel.r;
        this.g = viewModel.g;
        this.b = viewModel.b;
    }

    public toApiModel(): RGBColor {
        return {
            r: this.r,
            g: this.g,
            b: this.b
        };
    }
}