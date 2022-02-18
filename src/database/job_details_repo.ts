import mysqlPool from './mysql'
import logging from '../config/logging'
import { JobDetails } from '../domain/entities/job_details'

const NAMESPACE = 'JobDetailsRepo'
export class JobDetailsRepo {

    async saveJobDetails(jobDetailsList: any[]): Promise<string> {
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
}