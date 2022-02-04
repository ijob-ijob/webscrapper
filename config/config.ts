import dotenv from 'dotenv';

dotenv.config();

const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_PORT = process.env.MYSQL_PORT || 3307;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'IJOB_IJOB_DB';
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASS = process.env.MYSQL_PASSWORD || '';

const MYSQL = {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    database: MYSQL_DATABASE,
    user: MYSQL_USER,
    password: MYSQL_PASS
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3000;

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};

const config = {
    mysql: MYSQL,
    server: SERVER
};

export default config;
