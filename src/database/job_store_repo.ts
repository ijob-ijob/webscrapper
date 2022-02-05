import mysqlPool from './mysql'
import Platform from '../domain/platform'
import { JobStore, JobStoreEntity } from '../domain/job_store'
import logging from '../config/logging'

const NAMESPACE = 'JobStoreRepo'
export class JobStoreRepo {
  async getJobStoreByJobLinksAndPlatform (jobLinks: string[], platform: string) : Promise<JobStore[]> {
    const statement = 'select * from JOB_STORE inner join PLATFORM on JOB_STORE.platform_id = PLATFORM.platform_id where link in (?) and name = ?'

    try {
      const results = await mysqlPool.query(statement, [jobLinks, platform])
      const jobStores: JobStore[] = []
      Object.keys(results).forEach(function (key) {
        const row = results[key]
        jobStores.push(row)
      })
      return jobStores
    } catch (error) {
      logging.error(NAMESPACE, 'An error occurred', error)
      throw new Error(`Error occurred ${error}`)
    }
  }

  async saveJobStore (jobStoreList: JobStoreEntity[]) {
    const statement = 'insert into JOB_STORE (link, updated_at, data, platform_id) values ?'

    try {
      // console.log(JSON.stringify(jobStoreList))
      await mysqlPool.query({ sql: statement, values: jobStoreList })
    } catch (error) {
      logging.error(NAMESPACE, 'Failed to insert job store list', error)
      throw error
    }

    logging.info(NAMESPACE, 'Successfully inserted job store list')
  }

  async getPlatformInfo (platformName: string) : Promise<Platform> {
    const selectPlatformId = 'select * from  `PLATFORM` where `name` = ?'

    let results : Platform[]

    try {
      const rows = await mysqlPool.query(selectPlatformId, [platformName])
      results = <Platform[]>rows[0]
    } catch (error) {
      logging.error(NAMESPACE, 'Failed to get platform id', error)
      throw error
    }

    const platform: Platform = results[0]
    if (results.length > 1) {
      throw new Error('Found many platform Ids, while expecting only one')
    } else if (results.length < 1) {
      throw new Error('Could not find platform Id, results empty')
    }

    if (!platform) {
      throw new Error('Failed to get platform id')
    }

    // console.log('here is the platform' + JSON.stringify(platform))
    return platform
  }
}
