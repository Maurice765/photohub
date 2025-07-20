import { RGBColorClientModel } from "@core/clients/models/photo/rgb-vector.client-model";
import { RGBColor } from "@shared/models/rgbColor.interface";

export class RGBColorViewModel implements RGBColor {
    public r: number;
    public g: number;
    public b: number

    constructor(r: number, g: number, b: number) { 
        this.r = r;
        this.g = g;
        this.b = b;
    }
    
    toClientModel(): RGBColorClientModel {
        return {
            r: this.r,
            g: this.g,
            b: this.b
        };
    }
}