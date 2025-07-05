import oracledb
from src.config import settings

def get_connection():
    """
    Creates and returns a new Oracle database connection.
    This function can be used as a dependency in your routes.
    """
    return oracledb.connect(
        user=settings.ORACLE_USER,
        password=settings.ORACLE_PASSWORD,
        dsn=settings.ORACLE_DSN
    )