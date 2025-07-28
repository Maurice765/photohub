from src.exceptions import ResourceNotFound

class CategoryNotFound(ResourceNotFound):
    """Exception raised for category-not-found errors."""
    def __init__(self, category_id: int | None = None):
        resource_name = (
            f"Category with ID {category_id}"
            if category_id is not None else "Category"
        )
        super().__init__(
            resource_name=resource_name
        )