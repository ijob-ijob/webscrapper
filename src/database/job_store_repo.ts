import mysqlPool from './mysql'
import logging from '../config/logging'
import { Platform } from '../domain/platform'
import { JobStore, JobStoreEntity, JobStoreDb, JobStoreEntityDb } from '../domain/job_store'

const NAMESPACE = 'JobStoreRepo'

export class JobStoreRepo {

    async getJobStoreByJobLinksAndPlatform(platform: string): Promise<JobStore[]> {
        const statement = 'select * from JOB_STORE inner join PLATFORM on JOB_STORE.platform_id = PLATFORM.platform_id where updated_at is null and name = ?'

        try {
            const results = await mysqlPool.query(statement, [platform])
            const jobDetailsDbList: JobStoreDb[] = <JobStoreDb[]>results[0]
            const jobDetailsList: JobStore[] = jobDetailsDbList.map((jobDetailsDb) => jobDetailsDb.jobStore())
            logging.info(NAMESPACE, 'Finished getting job store by links and platfirm', jobDetailsList)
            return jobDetailsList
        } catch (error) {
            logging.error(NAMESPACE, 'An error occurred', error)
            throw new Error(`Error occurred ${error}`)
        }
    }

    async getJobStoreNotProcessed(limit: number): Promise<JobStoreEntity[]> {
        const statement = 'select * from JOB_STORE where updated_at is null limit ?';

        try {
            const results = await mysqlPool.query(statement, [limit]);
            const jobStoreEntityDbList: JobStoreEntityDb[] = <JobStoreEntityDb[]>results[0]
            const jobStoreEntityList: JobStoreEntity[] = jobStoreEntityDbList.map((jobStoreEntityDb) => jobStoreEntityDb.jobStoreEntity())
            logging.info(NAMESPACE, 'Finished getting job store not processed', jobStoreEntityList)
            return jobStoreEntityList
        } catch (error) {
            logging.error(NAMESPACE, 'An error occured while getting unprocessed job stores')
            throw new Error(`An error occured while geting unprocessed job stores ${error}`)
        }
    }

    async saveJobStore(jobStoreList: any): Promise<string> {
        return await new Promise<string>(async function (resolve, reject) {
            const statement = 'insert into JOB_STORE (link, data, platform_id) values ?'

            try {
                await mysqlPool.query(statement, [jobStoreList])
                logging.info(NAMESPACE, 'Successfully inserted job store list')
                resolve('success')
            } catch (error) {
                logging.error(NAMESPACE, 'Failed to insert job store list', error)
                reject(`Failed to insert job store list ${error}`)
            }
        })

    }

    async updateJobStoreBulk(jobStoreList: JobStoreEntity[]): Promise<string> {

        let params = jobStoreList.map((jobStore) => {
            return {
                "jobStoreId": JSON.parse(JSON.stringify(jobStore)).JOB_STORE_ID,
                "updatedAt": new Date().toISOString().slice(0, 19).replace('T', ' ')
            }
        })

        let statements = ''
        params.forEach((param) => {
            statements += `update JOB_STORE set updated_at = \"${param.updatedAt}\" where job_store_id = ${param.jobStoreId};`
        })

        return await new Promise<string>(async function (resolve, reject) {
            try {
                await mysqlPool.query(statements)
                logging.info(NAMESPACE, 'Successfully updated job store bulk')
                return resolve('success')
            } catch (error) {
                logging.error(NAMESPACE, `Failed to update job store bulk`, error)
                return reject(`Failed to update job store bulk ${error}`)
            }
        })

    }
}
