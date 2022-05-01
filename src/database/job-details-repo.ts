import mysqlPool from './mysql'
import logging from '../config/logging'
import { JobDetails, JobDetailsDb } from '../domain/entities/job-details'

const NAMESPACE = 'JobDetailsRepo'
export class JobDetailsRepo {
  public async saveJobDetails (jobDetailsList: any[]): Promise<string> {
    const statement = 'insert into JOB_DETAILS (title, link, type, platform_id, reference, salary_min, salary_max, location, closing_date, employer, job_store_id) values ?'

    try {
      await mysqlPool.query(statement, [jobDetailsList])
      logging.info(NAMESPACE, 'Successfully inserted job details list into the db')
      return new Promise((resolve) => {
        return resolve('Success')
      })
    } catch (error) {
      logging.error(NAMESPACE, 'An error happened while trying to insert job details list into the db', error)
      return new Promise((resolve, reject) => {
        return reject(new Error(`An error happened while trying to insert job details list to the db ${error}`))
      })
    }
  }

  public async getJobDetailsByJobStoreId (jobStoreIdList: number[], limit: number): Promise<JobDetails[]> {
    const statement = 'select * from JOB_DETAILS where JOB_STORE_ID in ? LIMIT ?'

    try {
      const results = await mysqlPool.query(statement, [jobStoreIdList, limit])
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
          salaryMax: jobDetailsDb.SALARY_MAX,
          salaryMin: jobDetailsDb.SALARY_MIN,
          reference: jobDetailsDb.REFERENCE,
          title: jobDetailsDb.TITLE,
          id: jobDetailsDb.JOB_DETAILS_ID
        }
      })
      logging.info(NAMESPACE, 'Finished getting job details by store ID list', jobDetailsList)
      return new Promise<JobDetails[]>((resolve) => {
        resolve(jobDetailsList)
      })
    } catch (error) {
      logging.error(NAMESPACE, 'An error occurred while getting job details By store ID list', jobStoreIdList)
      return new Promise<JobDetails[]>((resolve, reject) => {
        reject(new Error(`An error occurred while getting job details by Store ID list for ${NAMESPACE}::error::${error}`))
      })
    }
  }
}
