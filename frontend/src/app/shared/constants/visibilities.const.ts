import { VisibilityClientEnum } from "@core/clientEnums/visibility.client-enum";
import { SelectorItem } from "@shared/models/selector-item.interface";

export const VISIBILITIES: SelectorItem[] = [
    { name: 'Public', key:  VisibilityClientEnum.Public },
    { name: 'Private', key: VisibilityClientEnum.Private }
];