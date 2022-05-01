import * as dotenv from 'dotenv'

dotenv.config()

const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost'
const MYSQL_PORT = process.env.MYSQL_PORT || 3306
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'IJOB_IJOB_DB'
const MYSQL_USER = process.env.MYSQL_USER || 'root'
const MYSQL_PASS = process.env.MYSQL_PASSWORD || 'root'
const MYSQL_REJ_UNAUTH = process.env.MYSQL_REJ_UNAUTH || true

const MYSQL = {
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  database: MYSQL_DATABASE,
  user: MYSQL_USER,
  password: MYSQL_PASS,
  rejectUnauthorized: MYSQL_REJ_UNAUTH === 'true'
}

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost'
const SERVER_PORT = process.env.SERVER_PORT || 3000

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT
}

const config = {
  mysql: MYSQL,
  server: SERVER
}

export default config
