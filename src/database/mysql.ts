import { createPool, Pool } from 'mysql2'
import { Pool as PromisePool } from 'mysql2/promise'
import { EnvType } from '../domain/constant/env-type'
import config from '../config/config'
import * as process from 'process'
import * as fs from 'fs'
import * as path from 'path'

let pool: Pool
if (process.env.NODE_ENV === EnvType.PRODUCTION) {
  pool = createPool(
    {
      host: config.mysql.host,
      database: config.mysql.database,
      port: +config.mysql.port,
      user: config.mysql.user,
      password: config.mysql.password,
      multipleStatements: true,
      ssl: {
        ca: fs.readFileSync(path.join(__dirname, '../certs/').concat('rds-ca-2019-eu-west-2.pem'), 'utf8'),
        rejectUnauthorized: config.mysql.rejectUnauthorized
      }
    })
} else if (process.env.NODE_ENV === EnvType.TEST) {
  pool = createPool({
    host: config.mysql.host,
    database: config.mysql.database,
    port: +config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    multipleStatements: true,
    ssl: {
      ca: fs.readFileSync(path.join(__dirname, '../certs/').concat('rds-ca-2019-eu-west-2.pem'), 'utf8'),
      rejectUnauthorized: config.mysql.rejectUnauthorized
    }
  })
} else {
  pool = createPool({
    host: config.mysql.host,
    database: config.mysql.database,
    port: +config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    multipleStatements: true
  })
}
const mysqlPool: PromisePool = pool.promise()

export default mysqlPool
