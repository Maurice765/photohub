-- Benutzer anlegen
CREATE USER photohub IDENTIFIED BY admin
DEFAULT TABLESPACE users
TEMPORARY TABLESPACE temp
QUOTA UNLIMITED ON users;

-- Grundlegende Berechtigungen für photohub
GRANT CREATE SESSION TO photohub;
GRANT CREATE TABLE TO photohub;
GRANT CREATE SEQUENCE TO photohub;
GRANT CREATE PROCEDURE TO photohub;
GRANT CREATE TRIGGER TO photohub;

-- Zusätzliche Berechtigungen für Tests
GRANT CREATE USER TO photohub;
GRANT ALTER USER TO photohub;
GRANT DROP USER TO photohub;
GRANT CREATE TABLESPACE TO photohub;
GRANT DROP TABLESPACE TO photohub;

-- Für Tests mit Views / Materialized Views
GRANT CREATE VIEW TO photohub;
GRANT CREATE MATERIALIZED VIEW TO photohub;