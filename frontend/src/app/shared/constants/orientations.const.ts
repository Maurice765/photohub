import { OrientationClientEnum } from "@core/clientEnums/orientation.client-enum";
import { SelectorItem } from "@shared/models/selector-item.interface";

export const ORIENTATIONS: SelectorItem[] = [
    { name: 'Horizontal', key: OrientationClientEnum.Horizontal },
    { name: 'Vertical', key: OrientationClientEnum.Vertical },
    { name: 'Square', key: OrientationClientEnum.Square }
];