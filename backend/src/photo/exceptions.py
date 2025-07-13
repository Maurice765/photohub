from src.exceptions import ResourceNotFound, AppException
from fastapi import status

class PhotoNotFound(ResourceNotFound):
    """Exception raised when a specific photo is not found."""
    def __init__(self):
        super().__init__(resource_name="Photo")

class InvalidImageFormat(AppException):
    """Exception raised when an uploaded file cannot be processed as an image."""
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image could not be processed. Ensure it is a valid image format."
        )

class PhotoUploadError(AppException):
    """Exception raised for errors during the photo upload and processing."""
    def __init__(self, reason: str):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload and process photo: {reason}"
        )

class PhotoSearchError(AppException):
    """Exception raised for errors during a photo search operation."""
    def __init__(self, reason: str):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to search for photos: {reason}"
        )

class EmptyFileError(AppException):
    """Exception raised when an uploaded file is empty."""
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot upload an empty file."
        )

class InvalidPhotoContentType(AppException):
    """Exception raised when the uploaded photo has an invalid MIME type."""
    def __init__(self, allowed_mime_types: list[str]):
        super().__init__(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=(
                f"The uploaded file is not a supported image type."
                f"Supported types are: {', '.join(allowed_mime_types)}."
            )
        )

class PhotoTooLarge(AppException):
    """Exception raised when the uploaded photo exceeds allowed size."""
    def __init__(self, max_size_bytes: int):
        super().__init__(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=(
                f"The uploaded photo exceeds the maximum allowed size."
                f"Maximum size is {max_size_bytes // 1024 // 1024}MB."
            )
        )