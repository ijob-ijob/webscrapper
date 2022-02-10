import mysqlPool from './mysql'
import logging from '../config/logging'
import Platform from '../domain/platform'
import { JobStore, JobStoreEntity } from '../domain/job_store'

const NAMESPACE = 'JobStoreRepo'

export class JobStoreRepo {

    async getJobStoreByJobLinksAndPlatform(platform: string): Promise<JobStore[]> {
        const statement = 'select * from JOB_STORE inner join PLATFORM on JOB_STORE.platform_id = PLATFORM.platform_id where updated_at is null and name = ?'

        try {
            const results = await mysqlPool.query(statement, [platform])
            return <JobStore[]>results[0]
        } catch (error) {
            logging.error(NAMESPACE, 'An error occurred', error)
            throw new Error(`Error occurred ${error}`)
        }
    }

    async getJobStoreNotProcessed(limit: number): Promise<JobStoreEntity[]> {
        const statement = 'select * from JOB_STORE where updated_at is null limit ?';

        try {
            const results = await mysqlPool.query(statement, [limit]);
            return <JobStoreEntity[]>results[0]
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

        let params: any[] = jobStoreList.map((jobStore) => {
            return {
                "jobStoreId": jobStore.jobStoreId,
                "updatedAt": new Date().toDateString()
            }
        })

        let statements = ''
        params.forEach((param) => {
            statements += `update JOB_STORE set updated_at = ${param.updatedAt} where job_store_id = ${param.updatedAt};`
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
