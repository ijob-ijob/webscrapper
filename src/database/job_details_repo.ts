import mysqlPool from './mysql'
import logging from '../config/logging'
import { JobDetails } from '../domain/job_details'

const NAMESPACE = 'JobDetailsRepo'
export class JobDetailsRepo {

    async saveJobDetails(jobDetailsList: JobDetails[]): Promise<string> {
        const statement = 'insert into JOB_DETAILS (link, data, platform_id) values ?'

        return new Promise<string>(async function (resolve, reject) {
            try {
                await mysqlPool.query(statement, [jobDetailsList])
                logging.info(NAMESPACE, 'Successfully inserted job details list into the db')
                resolve('Success')
            } catch (error) {
                logging.error(NAMESPACE, 'An error happened while trying to insert job details list into the db', error)
                reject(`An error happened while trying to insert job details list to the db ${error}`)
            }
        })
    }
}