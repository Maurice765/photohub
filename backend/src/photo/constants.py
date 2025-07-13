from enum import Enum

class AllowedPhotoContentType(str, Enum):
    JPEG = 'image/jpeg'
    PNG = 'image/png'
    GIF = 'image/gif'

class Visibility(str, Enum):
    PUBLIC = 'public'
    PRIVATE = 'private'

class Orientation(str, Enum):
    HORIZONTAL = 'horizontal'
    VERTICAL = 'vertical',
    SQUARE = 'square'