from fastapi import HTTPException, status

class AppException(HTTPException):
    """
    Base class for custom exceptions in this application.
    """
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)


class ResourceNotFound(AppException):
    """
    A generic exception for when a requested resource is not found.
    """
    def __init__(self, resource_name: str = "Resource"):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{resource_name} not found."
        )