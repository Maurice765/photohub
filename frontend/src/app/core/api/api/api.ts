export * from './default.service';
import { DefaultApiService } from './default.service';
export * from './photo.service';
import { PhotoApiService } from './photo.service';
export const APIS = [DefaultApiService, PhotoApiService];
