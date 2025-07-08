import { RGBVectorClientModel } from "@core/clients/models/photo/rgb-vector.client-model";

export class RGBVectorViewModel {
    public r: number;
    public g: number;
    public b: number

    constructor(r: number, g: number, b: number) { 
        this.r = r;
        this.g = g;
        this.b = b;
    }
    
    toClientModel(): RGBVectorClientModel {
        return {
            r_target: this.r,
            g_target: this.g,
            b_target: this.b
        };
    }
}