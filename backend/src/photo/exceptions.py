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