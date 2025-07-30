import { inject, Injectable } from '@angular/core';
import { CategoryClient } from '@core/clients/category.client';
import { SelectorItem } from '@shared/models/selector-item.interface';
import { PrimeNG } from 'primeng/config';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FileService {
    private primengConfig: PrimeNG = inject(PrimeNG);
    
    public formatSize(bytes: number): string {
        const k = 1024;
        const dm = 3;
        const sizes = this.primengConfig.translation.fileSizeTypes;
        if (bytes === 0) {
            return `0 ${sizes?.[0] ?? "B"}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

        return `${formattedSize} ${sizes?.[i]}`;
    }
}