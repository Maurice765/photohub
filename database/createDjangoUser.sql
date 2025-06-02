-- Benutzer anlegen
CREATE USER django IDENTIFIED BY admin
DEFAULT TABLESPACE users
TEMPORARY TABLESPACE temp
QUOTA UNLIMITED ON users;

-- Grundlegende Berechtigungen für Django
GRANT CREATE SESSION TO django;
GRANT CREATE TABLE TO django;
GRANT CREATE SEQUENCE TO django;
GRANT CREATE PROCEDURE TO django;
GRANT CREATE TRIGGER TO django;

-- Zusätzliche Berechtigungen für Tests
GRANT CREATE USER TO django;
GRANT ALTER USER TO django;
GRANT DROP USER TO django;
GRANT CREATE TABLESPACE TO django;
GRANT DROP TABLESPACE TO django;

-- Für Tests mit Views / Materialized Views
GRANT CREATE VIEW TO django;
GRANT CREATE MATERIALIZED VIEW TO django;

-- Zugriff auf benötigte Systempakete
GRANT EXECUTE ON SYS.DBMS_LOB TO django;
GRANT EXECUTE ON SYS.DBMS_RANDOM TO django;
