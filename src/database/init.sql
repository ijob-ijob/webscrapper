CREATE DATABASE IF NOT EXISTS IJOB_IJOB_DB;

USE IJOB_IJOB_DB;

CREATE TABLE IF NOT EXISTS PLATFORM (
    PLATFORM_ID BIGINT AUTO_INCREMENT,
    NAME VARCHAR(150) NOT NULL,
    TYPE VARCHAR(100) NOT NULL,
    SUPPORTED_FROM DATETIME NOT NULL,
    SUPPORTED_TO DATETIME,
    PRIMARY kEY (PLATFORM_ID)
)AUTO_INCREMENT=10000;

CREATE TABLE IF NOT EXISTS JOB_STORE (
    JOB_STORE_ID BIGINT AUTO_INCREMENT,
    LINK VARCHAR(500) NOT NULL UNIQUE,
    DATA JSON NOT NULL,
    PLATFORM_ID BIGINT NOT NULL,
    UPDATED_AT DATETIME,
    PRIMARY KEY (JOB_STORE_ID),
    FOREIGN KEY (PLATFORM_ID) REFERENCES PLATFORM(PLATFORM_ID)
)AUTO_INCREMENT=10000;

CREATE TABLE IF NOT EXISTS JOB_DETAILS (
    JOB_DETAILS_ID BIGINT AUTO_INCREMENT,
    TITLE VARCHAR(250) NOT NULL,
    DESCRIPTION VARCHAR(500),
    TYPE VARCHAR(100) NOT NULL,
    PLATFORM_ID BIGINT NOT NULL,
    REFERENCE VARCHAR(100),
    SALARY_MIN VARCHAR(100),
    SALARY_MAX VARCHAR(100),
    COUNTRY VARCHAR(100),
    LOCATION VARCHAR(150) NOT NULL,
    CLOSING_DATE DATETIME,
    EMPLOYER VARCHAR(200),
    LINK VARCHAR(750) NOT NULL,
    JOB_STORE_ID BIGINT NOT NULL,
    PRIMARY KEY (JOB_DETAILS_ID),
    FOREIGN KEY (PLATFORM_ID) REFERENCES PLATFORM(PLATFORM_ID),
    FOREIGN KEY (JOB_STORE_ID) REFERENCES JOB_STORE(JOB_STORE_ID)
);


INSERT INTO PLATFORM (name, type, supported_from)
VALUES ('Careers24', 'source', '2021-07-04 18:39:36');
