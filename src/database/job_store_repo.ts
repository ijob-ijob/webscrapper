import mysqlPool from './mysql'
import Platform from '../domain/platform'
import { JobStore, JobStoreEntity } from '../domain/job_store'
import logging from '../config/logging'

const NAMESPACE = 'JobStoreRepo'
export class JobStoreRepo {

  async getJobStoreByJobLinksAndPlatform (platform: string) : Promise<JobStore[]> {
    const statement = 'select * from JOB_STORE inner join PLATFORM on JOB_STORE.platform_id = PLATFORM.platform_id where updated_at is null and name = ?'

    try {
      const results = await mysqlPool.query(statement, [platform])
      return <JobStore[]>results[0]
    } catch (error) {
      logging.error(NAMESPACE, 'An error occurred', error)
      throw new Error(`Error occurred ${error}`)
    }
  }

  async saveJobStore (jobStoreList: any) {
    const statement = 'insert into JOB_STORE (link, data, platform_id) values ?'

    try {
      await mysqlPool.query(statement, [jobStoreList])
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
