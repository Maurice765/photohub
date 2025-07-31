from src.category import exceptions
from src.database import get_connection
from src.category import schemas

async def get_category(category_id: int) -> schemas.CategoryGetResponse:
    """
    Fetches a category by its ID from the database.
    """
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT id, name, description, parent_category_id 
            FROM CATEGORY 
            WHERE id = :id
        """, {"id": category_id})

        row = cur.fetchone()
        if not row:
            raise exceptions.CategoryNotFound(category_id)

        return schemas.CategoryGetResponse(
            id=row[0],
            name=row[1],
            description=row[2],
            parent_id=row[3]
        )

    finally:
        cur.close()
        conn.close()

async def get_all_categories() -> list[schemas.CategoryGetResponse]:
    """
    Fetches all categories from the database.
    """
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT id, name, description, parent_category_id 
            FROM CATEGORY
        """)
        rows = cur.fetchall()

        return [
            schemas.CategoryGetResponse(
                id=row[0],
                name=row[1],
                description=row[2],
                parent_id=row[3]
            )
            for row in rows
        ]

    finally:
        cur.close()
        conn.close()