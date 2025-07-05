from enum import Enum

class AllowedPhotoContentType(str, Enum):
    JPEG = "image/jpeg"
    PNG = "image/png"
    GIF = "image/gif"

ERROR_MSG_PHOTO_TOO_LARGE = "The uploaded photo exceeds the maximum allowed size."
ERROR_MSG_INVALID_CONTENT_TYPE = "The uploaded file is not a supported image type."