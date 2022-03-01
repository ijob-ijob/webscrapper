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
    STATUS VARCHAR(50) NOT NULL,
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
    CLOSING_DATE VARCHAR(100),
    EMPLOYER VARCHAR(200),
    LINK VARCHAR(750) NOT NULL,
    JOB_STORE_ID BIGINT NOT NULL,
    PRIMARY KEY (JOB_DETAILS_ID),
    FOREIGN KEY (PLATFORM_ID) REFERENCES PLATFORM(PLATFORM_ID),
    FOREIGN KEY (JOB_STORE_ID) REFERENCES JOB_STORE(JOB_STORE_ID)
)AUTO_INCREMENT=10000;

CREATE TABLE IF NOT EXISTS SCHEDULER_CONF (
    SCHEDULER_CONF_ID BIGINT AUTO_INCREMENT,
    CRON VARCHAR(100) NOT NULL,
    DESCRIPTION VARCHAR(200),
    PLATFORM_ID BIGINT NOT NULL,
    SUPPORTED_FROM VARCHAR(100),
    SUPPORTED_TO VARCHAR(100),
    PRIMARY KEY (SCHEDULER_CONF_ID),
    FOREIGN KEY (PLATFORM_ID) REFERENCES PLATFORM(PLATFORM_ID)
)AUTO_INCREMENT=10000;

SELECT DISTINCT PLATFORM.PLATFORM_ID, PLATFORM.NAME, PLATFORM.TYPE, SCHEDULER_CONF.IDENTIFIER
FROM PLATFORM INNER JOIN SCHEDULER_CONF
ON PLATFORM.PLATFORM_ID = SCHEDULER_CONF.PLATFORM_ID
WHERE PLATFORM.SUPPORTED_TO IS NULL
AND SCHEDULER_CONF.SUPPORTED_TO IS NULL;

INSERT INTO SCHEDULER_CONF (cron, platform_id, supported_from, description, identifier)
VALUES ('* /5 * * * *', 10000, '2021-07-04 18:39:36', 'Careers24 job details resolver', 'CAREERS24JONDETAILSRESOLVER');

INSERT INTO SCHEDULER_CONF(cron, platform_id, supported_from, description, identifier)
VALUES ('* /5 * * * *', 10000, '2021-07-04 18:39:36', 'Careers24 job store importer', 'CAREERS24JOBSTOREIMPORTER');


INSERT INTO PLATFORM (name, type, supported_from)
VALUES ('Careers24', 'source', '2021-07-04 18:39:36');
