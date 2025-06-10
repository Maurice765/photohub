import oracledb

def get_connection():
    return oracledb.connect(
        user="photohub",
        password="admin",
        dsn="localhost:1521/ORCLPDB1"
    )