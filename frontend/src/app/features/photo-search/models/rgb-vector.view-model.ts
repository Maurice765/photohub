import { RGBVectorClientModel } from "@core/clients/models/photo/rgb-vector.client-model";

export class RGBVectorViewModel {
    public r: number;
    public g: number;
    public b: number;

    constructor() { 
        this.r = 0;
        this.g = 0;
        this.b = 0;
    }
    
    toClientModel(): RGBVectorClientModel {
        return {
            r_target: this.r,
            g_target: this.g,
            b_target: this.b
        };
    }
}