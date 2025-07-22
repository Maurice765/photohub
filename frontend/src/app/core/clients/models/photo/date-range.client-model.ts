import { DateRange } from "@core/api";

export class DateRangeClientModel {
    public start: Date;
    public end: Date;

    constructor(start: Date, end: Date) {
        this.start = start;
        this.end = end;
    }

    public toApiModel(): DateRange {
        return {
            start: this.start.toISOString(),
            end: this.end.toISOString()
        };
    }
}