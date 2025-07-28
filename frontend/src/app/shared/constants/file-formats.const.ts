import { FileFormatClientEnum } from "@core/clientEnums/file-format.client-enum";
import { SelectorItem } from "@shared/models/selector-item.interface";

export const FILE_FORMATS: SelectorItem[] = [
    { name: 'JPEG', key: FileFormatClientEnum.Jpeg },
    { name: 'PNG', key: FileFormatClientEnum.Png }
];