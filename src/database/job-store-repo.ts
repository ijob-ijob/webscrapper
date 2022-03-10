import mysqlPool from './mysql'
import logging from '../config/logging'
import { Platform } from '../domain/entities/platform'
import { JobStore, JobStoreEntity, JobStoreDb, JobStoreEntityDb } from '../domain/entities/job-store'

const NAMESPACE = 'JobStoreRepo'

export class JobStoreRepo {

    public async getJobStoreByPlatformName(platform: string): Promise<JobStoreEntity[]> {
        const statement = 'select JOB_STORE.* from JOB_STORE inner join PLATFORM on JOB_STORE.platform_id = PLATFORM.platform_id where updated_at is null and name = ?'

        try {
            const results = await mysqlPool.query(statement, [platform])
            const jobStoreDbList: JobStoreEntityDb[] = <JobStoreEntityDb[]>results[0]
            const jobDetailsList: JobStoreEntity[] = jobStoreDbList.map((jobStoreDb) => {
                return {
                    jobStoreId: jobStoreDb.JOB_STORE_ID,
                    link: jobStoreDb.LINK,
                    data: jobStoreDb.DATA,
                    updatedAt: jobStoreDb.UPDATED_AT,
                    status: jobStoreDb.STATUS,
                    platformId: jobStoreDb.PLATFORM_ID,
                    createdAt: jobStoreDb.CREATED_AT
                }
            })
           logging.info(NAMESPACE, 'Finished getting job store by links and platfirm', jobDetailsList)
            return jobDetailsList
        } catch (error) {
            logging.error(NAMESPACE, 'An error occurred', error)
            throw new Error(`Error occurred ${error}`)
        }
    }

    public async getJobStoreNotProcessed(platformId: number, limit: number): Promise<JobStoreEntity[]> {
        const statement = 'select * from JOB_STORE where updated_at is null and status != "ERROR" and platform_id =? limit ?';

        try {
            const results = await mysqlPool.query(statement, [platformId, limit]);
            const jobStoreEntityDbList: JobStoreEntityDb[] = <JobStoreEntityDb[]>results[0]
            const jobStoreEntityList: JobStoreEntity[] = []

            jobStoreEntityList.push(
                ...jobStoreEntityDbList.map((jobStoreEntityDb) => {
                    return {
                        jobStoreId: jobStoreEntityDb.JOB_STORE_ID,
                        link: jobStoreEntityDb.LINK,
                        data: jobStoreEntityDb.DATA,
                        platformId: jobStoreEntityDb.PLATFORM_ID,
                        updatedAt: jobStoreEntityDb.UPDATED_AT,
                        createdAt: jobStoreEntityDb.CREATED_AT,
                        status: jobStoreEntityDb.STATUS,
                    }
                }))
            logging.info(NAMESPACE, 'Finished getting job store not processed', jobStoreEntityList)
            return jobStoreEntityList
        } catch (error) {
            logging.error(NAMESPACE, 'An error occured while getting unprocessed job stores')
            throw new Error(`An error occured while geting unprocessed job stores ${error}`)
        }
    }

    public async saveJobStore(jobStoreList: any): Promise<string> {
        return await new Promise<string>(async function (resolve, reject) {
            const statement = 'insert into JOB_STORE (link, data, platform_id, status) values ?'

            try {
                await mysqlPool.query(statement, [jobStoreList])
                logging.info(NAMESPACE, 'Successfully inserted job store list')
                resolve('success')
            } catch (error) {
                logging.error(NAMESPACE, 'Failed to insert job store list', error)
                reject(`Failed to insert job store list::${error}`)
            }
        })

    }

    public async getDuplicates(limit: number): Promise<JobStoreEntity[]> {
        return await new Promise<JobStoreEntity[]>(async (resolve, reject) => {
            const statement = `select * from JOB_STORE where LINK IN (
                                        select LINK from JOB_STORE group by LINK having count(*) >= 2)  limit ?`

            try {
                const results = await mysqlPool.query(statement, [limit]);
                const jobStoreEntityDbList: JobStoreEntityDb[] = <JobStoreEntityDb[]>results[0]
                const jobStoreEntityList: JobStoreEntity[] = jobStoreEntityDbList.map((jobStoreEntityDb) => {
                    return {
                        jobStoreId: jobStoreEntityDb.JOB_STORE_ID,
                        link: jobStoreEntityDb.LINK,
                        data: jobStoreEntityDb.DATA,
                        platformId: jobStoreEntityDb.PLATFORM_ID,
                        updatedAt: jobStoreEntityDb.UPDATED_AT,
                        status: jobStoreEntityDb.STATUS,
                        createdAt: jobStoreEntityDb.CREATED_AT
                    }
                })
                logging.info(NAMESPACE, 'Finished getting duplicate job stores', jobStoreEntityList)
                return resolve(jobStoreEntityList)
            } catch (error) {
                logging.error(NAMESPACE, 'An error occured while getting duplicate store', error)
                return reject(new Error(`An error occured while getting job store duplicates for ${NAMESPACE}:::${error}`))
            }
        })
    }

    public async updateJobStoreBulk(jobStoreList: JobStoreEntity[]): Promise<string> {

        let params = jobStoreList.map((jobStore) => {
            return {
                "jobStoreId": jobStore.jobStoreId,
                "status": jobStore.status,
                "updatedAt": new Date().toISOString().slice(0, 19).replace('T', ' ')
            }
        })

        let statements = ''
        params.forEach((param) => {
            statements += `update JOB_STORE set updated_at = \"${param.updatedAt}\", status = \"${param.status}\" where job_store_id = ${param.jobStoreId};`
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
