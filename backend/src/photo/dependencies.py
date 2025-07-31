from fastapi import UploadFile
import filetype
from src.photo.config import photo_settings
from src.photo.constants import AllowedPhotoContentEnum
from src.photo import exceptions

async def validate_photo(file: UploadFile) -> UploadFile:
    """
    A dependency to validate an uploaded photo.
    """

    allowed_mime_types = [item.value for item in AllowedPhotoContentEnum]

    # 1. Validate declared Content-Type from client header
    if file.content_type not in allowed_mime_types:
        raise exceptions.InvalidPhotoContentType(allowed_mime_types=allowed_mime_types)

    # Read content into memory
    content = await file.read()

    if not content:
        raise exceptions.EmptyFileError()

    # 2. Validate MIME type by inspecting file content
    kind = filetype.guess(content)
    if not kind or kind.mime not in allowed_mime_types:
        raise exceptions.InvalidPhotoContentType(allowed_mime_types=allowed_mime_types)

    # 3. Validate file size
    if len(content) > photo_settings.MAX_PHOTO_SIZE_BYTES:
        raise exceptions.PhotoTooLarge(max_size_bytes=photo_settings.MAX_PHOTO_SIZE_BYTES)

    # Rewind file pointer for further processing
    file.file.seek(0)
    return file