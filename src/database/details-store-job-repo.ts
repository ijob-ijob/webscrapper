import { JobStoreEntity } from '../domain/entities/job-store'
import logging from '../config/logging'
import mysqlPool from '../database/mysql'

const NAMESPACE = 'DetailsStoreJobRepo'
export class DetailsStoreJobRepo {
  public async updateJobStoreAndDeleteJobDetailsDuplicates (jobStoreList: JobStoreEntity[]): Promise<void> {
    mysqlPool.getConnection()
      .then((conn) => {
        conn.beginTransaction()
          .then(() => {
            const jobStoreIdList: number[] = jobStoreList.map((jobStore) => {
              return jobStore.jobStoreId
            })
            conn.query('delete from JOB_DETAILS where JOB_STORE_ID IN (?)', [jobStoreIdList])
              .then(() => {
                logging.info(NAMESPACE, 'Successfully deleted job details duplicates')

                const jobStoreParams: any[] = jobStoreList.map((jobStore) => {
                  return {
                    jobStoreId: jobStore.jobStoreId,
                    status: jobStore.status,
                    updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
                  }
                })

                let jobStoreUpdateQuery = ''
                jobStoreParams.forEach((param) => {
                  jobStoreUpdateQuery += `update JOB_STORE set updated_at = "${param.updatedAt}", status = "${param.status}" where job_store_id = ${param.jobStoreId};`
                })

                conn.query(jobStoreUpdateQuery)
                  .then(() => {
                    logging.info(NAMESPACE, 'Successfully updated job store duplicates')
                    conn.commit()
                  }).catch((error) => {
                    conn.rollback()
                    logging.error(NAMESPACE, 'An error occurred while updating job store duplicates', error)
                    return new Promise((resolve, reject) => reject(new Error(`An error occurred while updating job store duplicates::${error}`)))
                  })
              }).catch((error) => {
                conn.rollback()
                logging.error(NAMESPACE, 'An error occurred while deleting job details duplicates', error)
                return new Promise((resolve, reject) => reject(new Error(`An error occurred while deleting job details duplicates::${error}`)))
              })
          }).catch((error) => {
            logging.error(NAMESPACE, 'An error occurred while starting a transaction', error)
            return new Promise((resolve, reject) => reject(new Error(`An error occurred while starting a transaction::${error}`)))
          })
      }).catch((error) => {
        logging.error(NAMESPACE, 'An error occurred while getting database connection', error)
        return new Promise((resolve, reject) => reject(new Error(`An error occurred while getting database connection::${error}`)))
      })

    return new Promise((resolve) => resolve())
  }

  public async saveJobDetailsAndUpdateJobStore (jobDetailsList: any[], jobStoreList: JobStoreEntity[]): Promise<void> {
    const jobInsertQuery = 'insert into JOB_DETAILS (title, link, type, platform_id, reference, salary_min, salary_max, location, closing_date, employer, job_store_id) values ?'

    mysqlPool.getConnection().then((conn) => {
      conn.beginTransaction()
        .then(() => {
          conn.query(jobInsertQuery, [jobDetailsList])
            .then(() => {
              const params = jobStoreList.map((jobStore) => {
                return {
                  jobStoreId: jobStore.jobStoreId,
                  status: jobStore.status,
                  updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
                }
              })

              let jobStoreUpdateQuery = ''
              params.forEach((param) => {
                jobStoreUpdateQuery += `update JOB_STORE set updated_at = "${param.updatedAt}", status = "${param.status}" where job_store_id = ${param.jobStoreId};`
              })

              conn.query(jobStoreUpdateQuery)
                .then(() => {
                  logging.info(NAMESPACE, 'Successfully updated job store')
                  conn.commit()
                }).catch((error) => {
                  logging.error(NAMESPACE, 'An error occurred while updating job store', error)
                  conn.rollback()
                  return new Promise((resolve, reject) => reject(new Error(`An error occurred while updating job store, ${error}`)))
                })
            }).catch((error) => {
              conn.rollback()
              logging.error(NAMESPACE, 'An error occurred while inserting job details', error)
              return new Promise((resolve, reject) => reject(new Error(`An error occurred while inserting job details, ${error}`)))
            })
        }).catch((error) => {
          logging.error(NAMESPACE, 'An error occurred starting transaction', error)
          return new Promise((resolve, reject) => reject(new Error(`An error occurred while starting transaction, ${error}`)))
        })
    }).catch((error) => {
      logging.error(NAMESPACE, 'An error occurred while getting connection to insert job details and update job store', error)
      return new Promise((resolve, reject) => reject(new Error(`An error occurred while getting connection to insert job details and update job store. ${error}`)))
    })

    return new Promise((resolve) => resolve())
  }
}
