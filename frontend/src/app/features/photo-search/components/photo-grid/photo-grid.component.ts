import { CommonModule } from "@angular/common";
import { Component, Input, signal } from "@angular/core";
import { ImageModule } from 'primeng/image';
import { DataViewModule } from 'primeng/dataview';
import { SelectButton } from 'primeng/selectbutton';
import { PhotoGridItemViewModel } from "@features/photo-search/models/photo-grid-item.view-model";
import { FormsModule } from "@angular/forms";

@Component({
	selector: "photo-grid",
	imports: [
		CommonModule, 
		FormsModule,
		DataViewModule, 
		ImageModule, 
		SelectButton,
	],
	templateUrl: "./photo-grid.component.html",
	styleUrls: ["./photo-grid.component.css"],
})
export class PhotoGridComponent {
	@Input() 
	public photos: PhotoGridItemViewModel[] = [];

	public layout: 'list' | 'grid' = 'grid';
	public options: string[] = ['list', 'grid'];
}