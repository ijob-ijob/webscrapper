import { JobDetails } from '../domain/job_details'
import { JobStore } from '../domain/job_store'
import logging from '../config/logging'
import mysqlPool from '../database/mysql'

const NAMESPACE = 'DetailsStoreJobRepo'
export class DetailsStoreJobRepo {

    public saveJobDetailsAndUpdateJobStore(jobDetailsList: any[], jobStoreList: JobStore[]): Promise<string> {
        return new Promise<string>(async function (resolve, reject) {
            const jobInsertQuery = `insert into JOB_DETAILS (title, link, type, platform_id, reference, salary_min, salary_max, location, closing_date, employer, job_store_id) values ?`

            mysqlPool.getConnection().then((conn) => {
                conn.beginTransaction()
                    .then(() => {
                        conn.query(jobInsertQuery, [jobDetailsList])
                        .then(() => {
                            let params = jobStoreList.map((jobStore) => {
                                return {
                                    "jobStoreId": jobStore.jobStoreId,
                                    "updatedAt": new Date().toISOString().slice(0, 19).replace('T', ' ')
                                }
                            })

                            let jobStoreUpdateQuery = ''
                            params.forEach((param) => {
                                jobStoreUpdateQuery += `update JOB_STORE set updated_at = \"${param.updatedAt}\" where job_store_id = ${param.jobStoreId};`
                            })
                        }).catch((error) => {
                            conn.rollback()
                            logging.error(NAMESPACE, 'An erorr occured while inserting job details', error)
                            return reject(`An error occured while inserting job details, ${error}`)
                    })
                }).catch((error) => {
                    logging.error(NAMESPACE, 'An error occured starting transaction', error)
                    return reject(`An error occured while starting transaction, ${error}`)
                })
            }).catch((error) => {
                logging.error(NAMESPACE, 'An error occured while getting connection to insert job details and update job store', error)
                return resolve(`An error occured while getting connection to insert job details and update job store. ${error}`)
            })
        })
    }
}