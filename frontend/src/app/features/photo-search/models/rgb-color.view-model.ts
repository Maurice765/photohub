import { RGBColor } from "@shared/models/rgb-color.interface";

export class RGBColorViewModel implements RGBColor {
    public r: number;
    public g: number;
    public b: number;

    constructor(r: number, g: number, b: number) { 
        this.r = r;
        this.g = g;
        this.b = b;
    }
}