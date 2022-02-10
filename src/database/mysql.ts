import { createPool, Pool } from 'mysql2'
import { Pool as PromisePool } from 'mysql2/promise'
import config from '../config/config'

const pool: Pool = createPool({
  host: config.mysql.host,
  database: config.mysql.database,
  port: +config.mysql.port,
  user: config.mysql.user,
  password: config.mysql.password,
  multipleStatements: true
})

const mysqlPool: PromisePool = pool.promise()

export default mysqlPool
