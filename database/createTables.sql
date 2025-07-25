DROP TABLE TAGS CASCADE CONSTRAINTS;
DROP TABLE LIKES CASCADE CONSTRAINTS;
DROP TABLE COMMENTS CASCADE CONSTRAINTS;
DROP TABLE ALBUM_PHOTO CASCADE CONSTRAINTS;
DROP TABLE ALBUM CASCADE CONSTRAINTS;
DROP TABLE COLOR_HISTOGRAM CASCADE CONSTRAINTS;
DROP TABLE PHOTO CASCADE CONSTRAINTS;
DROP TABLE CONTENT CASCADE CONSTRAINTS;
DROP TABLE CATEGORY CASCADE CONSTRAINTS;
DROP TABLE "USER" CASCADE CONSTRAINTS;


CREATE TABLE "USER" (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR2(255) UNIQUE NOT NULL,
    email VARCHAR2(255) UNIQUE NOT NULL,
    password VARCHAR2(255) NOT NULL,
    fname VARCHAR2(255),
    lname VARCHAR2(255),
    profile_picture BLOB,
    bio VARCHAR2(1000),
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE CATEGORY (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(255) UNIQUE NOT NULL,
    description VARCHAR2(255),
    parent_category_id NUMBER
);

ALTER TABLE CATEGORY ADD CONSTRAINT fk_parent_category FOREIGN KEY (parent_category_id) REFERENCES CATEGORY(id);

CREATE TABLE CONTENT (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER NOT NULL,
    category_id NUMBER,
    title VARCHAR2(255) NOT NULL,
    description VARCHAR2(1000),
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    visibility VARCHAR2(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private')) NOT NULL,
    views NUMBER DEFAULT 0 NOT NULL,
    content_type VARCHAR2(10) CHECK (content_type IN ('PHOTO', 'ALBUM')) NOT NULL,
    CONSTRAINT fk_content_user FOREIGN KEY (user_id) REFERENCES "USER"(id),
    CONSTRAINT fk_content_category FOREIGN KEY (category_id) REFERENCES CATEGORY(id)
);

CREATE TABLE PHOTO (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content_id NUMBER NOT NULL,
    image BLOB NOT NULL,
    file_type VARCHAR2(20),
    file_size NUMBER,
    location VARCHAR2(255),
    capture_date TIMESTAMP,
    file_hash VARCHAR2(64) UNIQUE,
    camera_model VARCHAR2(255),
    width NUMBER,
    height NUMBER,
    orientation VARCHAR2(15) CHECK (orientation IN ('horizontal', 'vertical', 'square')),
    CONSTRAINT fk_photo_content FOREIGN KEY (content_id) REFERENCES CONTENT(id),
    CONSTRAINT uq_photo_content UNIQUE (content_id)
);

CREATE OR REPLACE TYPE int_array_256_t AS VARRAY(256) OF NUMBER;

CREATE INDEX content_title_idx ON content(title)
    INDEXTYPE IS CTXSYS.CONTEXT;

CREATE INDEX content_description_idx ON content(description)
    INDEXTYPE IS CTXSYS.CONTEXT;

CREATE TABLE COLOR_HISTOGRAM (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    photo_id NUMBER NOT NULL,
    r_bins_norm int_array_256_t NOT NULL,
    g_bins_norm int_array_256_t NOT NULL,
    b_bins_norm int_array_256_t NOT NULL,
    CONSTRAINT fk_color_histogram_Photo FOREIGN KEY (photo_id) REFERENCES PHOTO(id)
);

CREATE TABLE ALBUM (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content_id NUMBER NOT NULL,
    cover_photo_id NUMBER,
    sort_order NUMBER,
    CONSTRAINT fk_album_content FOREIGN KEY (content_id) REFERENCES CONTENT(id),
    CONSTRAINT uq_album_content UNIQUE (content_id)
);

CREATE TABLE ALBUM_PHOTO (
    album_id NUMBER,
    photo_id NUMBER,
    PRIMARY KEY (album_id, photo_id),
    CONSTRAINT fk_ap_album FOREIGN KEY (album_id) REFERENCES ALBUM(id),
    CONSTRAINT fk_ap_photo FOREIGN KEY (photo_id) REFERENCES PHOTO(id)
);

ALTER TABLE ALBUM ADD CONSTRAINT fk_album_cover FOREIGN KEY (cover_photo_id) REFERENCES PHOTO(id);

CREATE TABLE COMMENTS (
    user_id NUMBER NOT NULL,
    content_id NUMBER NOT NULL,
    text VARCHAR2(1000) NOT NULL,
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, content_id),
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES "USER"(id),
    CONSTRAINT fk_comment_content FOREIGN KEY (content_id) REFERENCES CONTENT(id)
);

CREATE TABLE LIKES (
    user_id NUMBER,
    content_id NUMBER,
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, content_id),
    CONSTRAINT fk_like_user FOREIGN KEY (user_id) REFERENCES "USER"(id),
    CONSTRAINT fk_like_content FOREIGN KEY (content_id) REFERENCES CONTENT(id)
);

CREATE TABLE TAGS (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content_id NUMBER NOT NULL,
    title VARCHAR2(50) NOT NULL,
    CONSTRAINT fk_tag_content FOREIGN KEY (content_id) REFERENCES CONTENT(id)
);