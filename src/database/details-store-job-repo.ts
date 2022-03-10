import { JobDetails } from '../domain/entities/job-details'
import { JobStoreEntity } from '../domain/entities/job-store'
import logging from '../config/logging'
import mysqlPool from '../database/mysql'

const NAMESPACE = 'DetailsStoreJobRepo'
export class DetailsStoreJobRepo {

    public async updateJobStoreAndDeleteJobDetailsDuplicates(jobStoreList: JobStoreEntity[]): Promise<void> {
        return await new Promise<void>(((resolve, reject) => {
            mysqlPool.getConnection()
                .then((conn) => {
                  conn.beginTransaction()
                      .then(() => {
                          const jobStoreIdList: number[] = jobStoreList.map((jobStore) => {
                              return jobStore.jobStoreId
                          })
                          conn.query(`delete from JOB_DETAILS where JOB_STORE_ID IN (?)`, [jobStoreIdList])
                              .then(() => {
                                  logging.info(NAMESPACE, 'Successfully deleted job details duplicates')

                                  const jobStoreParams: any[] = jobStoreList.map((jobStore) => {
                                      return {
                                          "jobStoreId": jobStore.jobStoreId,
                                          "status": jobStore.status,
                                          "updatedAt": new Date().toISOString().slice(0, 19).replace('T', ' ')
                                      }
                                  })

                                  let jobStoreUpdateQuery = ''
                                  jobStoreParams.forEach((param) => {
                                      jobStoreUpdateQuery += `update JOB_STORE set updated_at = \"${param.updatedAt}\", status = \"${param.status}\" where job_store_id = ${param.jobStoreId};`
                                  })

                                  conn.query(jobStoreUpdateQuery)
                                      .then(() => {
                                          logging.info(NAMESPACE, 'Successfully updated job store duplicates')
                                          conn.commit()
                                          return resolve()
                                      }).catch((error) => {
                                          conn.rollback()
                                          logging.error(NAMESPACE, 'An error occured while updating job store duplicates', error)
                                      return reject(`An error occured while updating job store duplicates::${error}`)
                                  })
                              }).catch((error) => {
                                  conn.rollback()
                                  logging.error(NAMESPACE, 'An error occured while deleting job details duplicates', error)
                                  return reject(new Error(`An error occured while deleting job details duplicates::${error}`))
                              })
                      }).catch((error) => {
                          logging.error(NAMESPACE, 'An error occured while starting a transaction', error)
                          return reject(new Error(`An error occured while starting a transaction::${error}`))
                      })
                }).catch((error) => {
                    logging.error(NAMESPACE, 'An error occured while getting database connection', error)
                    return reject(`An error occured while getting database connection::${error}`)
                })
        }))
    }

    public async saveJobDetailsAndUpdateJobStore(jobDetailsList: any[], jobStoreList: JobStoreEntity[]): Promise<void> {
        return await new Promise<void>(async function (resolve, reject) {
            const jobInsertQuery = `insert into JOB_DETAILS (title, link, type, platform_id, reference, salary_min, salary_max, location, closing_date, employer, job_store_id) values ?`

            mysqlPool.getConnection().then((conn) => {
                conn.beginTransaction()
                    .then(() => {
                        conn.query(jobInsertQuery, [jobDetailsList])
                        .then(() => {
                            let params = jobStoreList.map((jobStore) => {
                                return {
                                    "jobStoreId": jobStore.jobStoreId,
                                    "status": jobStore.status,
                                    "updatedAt": new Date().toISOString().slice(0, 19).replace('T', ' ')
                                }
                            })

                            let jobStoreUpdateQuery = ''
                            params.forEach((param) => {
                                jobStoreUpdateQuery += `update JOB_STORE set updated_at = \"${param.updatedAt}\", status = \"${param.status}\" where job_store_id = ${param.jobStoreId};`
                            })

                            conn.query(jobStoreUpdateQuery)
                                .then(() => {
                                   logging.info(NAMESPACE, 'Successfully updated job store')
                                    conn.commit()
                                   return resolve()
                                }).catch((error) => {
                                    logging.error(NAMESPACE, 'An error occured while updating job store', error)
                                    conn.rollback()
                                    return reject(new Error(`An error occured while updating job store, ${error}`))
                                })
                        }).catch((error) => {
                            conn.rollback()
                            logging.error(NAMESPACE, 'An erorr occured while inserting job details', error)
                            return reject(new Error(`An error occured while inserting job details, ${error}`))
                    })
                }).catch((error) => {
                    logging.error(NAMESPACE, 'An error occured starting transaction', error)
                    return reject(new Error(`An error occured while starting transaction, ${error}`))
                })
            }).catch((error) => {
                logging.error(NAMESPACE, 'An error occured while getting connection to insert job details and update job store', error)
                return reject(new Error(`An error occured while getting connection to insert job details and update job store. ${error}`))
            })
        })
    }
}