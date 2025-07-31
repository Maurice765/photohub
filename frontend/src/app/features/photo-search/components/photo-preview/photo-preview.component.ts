import { CommonModule, NgOptimizedImage } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input, output } from "@angular/core";

@Component({
    selector: "photo-preview",
    imports: [
        CommonModule,
        NgOptimizedImage
    ],
    templateUrl: "./photo-preview.component.html",
    styleUrls: ["./photo-preview.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoPreviewComponent {
    public photoId = input.required<number>();
    public previewUrl = input.required<string>();

    public onClick = output<number>();

    public openDetails(): void {
        this.onClick.emit(this.photoId());
    }
}