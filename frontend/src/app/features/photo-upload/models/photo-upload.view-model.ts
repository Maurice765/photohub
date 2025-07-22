import { VisibilityClientEnum } from "@core/clients/enums/visibility.client-enum";
import { PhotoUploadRequestClientModel } from "@core/clients/models/photo/photo-upload-request.client-model";
import { PhotoUploadFormViewModel } from "./photo-upload-form.view-model";
import { FormGroupValue } from "@shared/types/form-group-value.type";

type PhotoUploadFormValue = FormGroupValue<PhotoUploadFormViewModel>;

export class PhotoUploadViewModel {
    public file: File;
    public title: string;
    public visibility: VisibilityClientEnum;
    public description?: string;
    public location?: string;
    public cameraModel?: string;
    public captureDate?: Date; 

    constructor(form: PhotoUploadFormValue) {
        if (!form.file || !form.title || !form.visibility) {
            throw new Error("Cannot create a ViewModel from an invalid form. Required fields are missing.");
        }

        this.file = form.file;
        this.title = form.title;
        this.visibility = form.visibility;
        this.description = form?.description ?? undefined;
        this.location = form?.location ?? undefined;
        this.cameraModel = form?.cameraModel ?? undefined;
        this.captureDate = form?.captureDate ?? undefined;
    }
}