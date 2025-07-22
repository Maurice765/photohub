from enum import Enum

class AllowedPhotoContentEnum(str, Enum):
    JPEG = 'image/jpeg'
    PNG = 'image/png'
    GIF = 'image/gif'

class VisibilityEnum(str, Enum):
    PUBLIC = 'public'
    PRIVATE = 'private'

class OrientationEnum(str, Enum):
    HORIZONTAL = 'horizontal'
    VERTICAL = 'vertical'
    SQUARE = 'square'

class FileFormatEnum(str, Enum):
    PNG = "png"
    JPEG = "jpeg"