import mysqlPool from './mysql'
import logging from '../config/logging'
import { JobDetails, JobDetailsDb } from '../domain/entities/job-details'

const NAMESPACE = 'JobDetailsRepo'
export class JobDetailsRepo {

    public async saveJobDetails(jobDetailsList: any[]): Promise<string> {
        const statement = `insert into JOB_DETAILS (title, link, type, platform_id, reference, salary_min, salary_max, location, closing_date, employer, job_store_id) values ?`

        return await new Promise<string>(async function (resolve, reject) {
            try {
                await mysqlPool.query(statement, [jobDetailsList])
                logging.info(NAMESPACE, 'Successfully inserted job details list into the db')
                return resolve('Success')
            } catch (error) {
                logging.error(NAMESPACE, 'An error happened while trying to insert job details list into the db', error)
                return reject(`An error happened while trying to insert job details list to the db ${error}`)
            }
        })
    }

    public async getJobDetailsByJobStoreId(jobStoreIdList: number[], limit: number): Promise<JobDetails[]> {
        const statement = `select * from JOB_DETAILS where JOB_STORE_ID in ?`
        return await new Promise<JobDetails[]>(async (resolve, reject) => {
            try {
                const results = await mysqlPool.query(statement, [jobStoreIdList])
                const jobDetailsDbList: JobDetailsDb[] = <JobDetailsDb[]>results[0]
                const jobDetailsList: JobDetails[] = jobDetailsDbList.map((jobDetailsDb) => {
                    return {
                        jobStoreId: jobDetailsDb.JOB_STORE_ID,
                        link: jobDetailsDb.LINK,
                        platformId: jobDetailsDb.PLATFORM_ID,
                        type: jobDetailsDb.TYPE,
                        employer: jobDetailsDb.EMPLOYER,
                        closingDate: jobDetailsDb.CLOSING_DATE,
                        location: jobDetailsDb.LOCATION,
                        salaryMax: jobDetailsDb.SALAMY_MAX,
                        salaryMin: jobDetailsDb.SALAMY_MIN,
                        reference: jobDetailsDb.REFERENCE,
                        title: jobDetailsDb.TITLE,
                        id: jobDetailsDb.JOB_DETAILS_ID
                    }
                })
                logging.info(NAMESPACE, 'Finished getting job details by store ID list', jobDetailsList)
                return resolve(jobDetailsList)
            } catch (error) {
                logging.error(NAMESPACE, 'An error occured while getting job details By store ID list', jobStoreIdList)
                return reject(new Error(`An error occured while getting job details by Store ID list for ${NAMESPACE}::error::${error}`))
            }
        })
    }
}