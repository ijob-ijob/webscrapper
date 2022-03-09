import { GlobalContainer } from '../../container/global-container'
import { JobStoreEntity } from '../../domain/entities/job-store'
import { JobDetails } from '../../domain/entities/job-details'
import { JobStoreStatusType } from '../../domain/constant/job-store-status-type'
import logging from '../../config/logging'

const NAMESPACE = 'DuplicateCleaner'
export class DuplicateCleaner {

    constructor(private glabalContainer: GlobalContainer) {
    }

    public async cleanDuplicates(): Promise<void> {
        return await new Promise<void>(async (resolve, reject) => {
            let duplicateJobStoreList: JobStoreEntity[] = []

            this.glabalContainer.getRepoContainer().getJobStoreRepo().getDuplicates(20)
                .then((jobStoreDuplicateList: JobStoreEntity[]) => {
                    jobStoreDuplicateList.push(...jobStoreDuplicateList)
                }).catch((error) => {
                logging.error(NAMESPACE, 'An error occured while fetching duplocate job stores', error)
                return reject(new Error(`An error occured while fetching duplicate job stores for ${NAMESPACE}::error::${error}`))
            })

            if (duplicateJobStoreList.length === 0) {
                logging.info(NAMESPACE, 'No duplicate job stores found for processing')
                return resolve()
            }

            const jobStoreIdList: number[] = duplicateJobStoreList.map((duplicateJobStore) => {
                return duplicateJobStore.jobStoreId
            })

            let duplicateJobDetailsList: JobDetails[] = []
            this.glabalContainer.getRepoContainer().getJobDetailsRepo().getJobDetailsByJobStoreId(jobStoreIdList, 20)
                .then((jobDetailsDuplicate) => {
                    duplicateJobDetailsList.push(...jobDetailsDuplicate)
                }).catch((error) => {
                    logging.error(NAMESPACE, 'An error occured whole fetching job details duplicates', error)
                return reject(new Error(`An error occured while fetching job details duplicate for ${NAMESPACE}::error::${error}`))
                })

            duplicateJobStoreList.forEach((duplicateJobStore) => {
                duplicateJobStore.status = JobStoreStatusType.DUPLICATE
            })

            duplicateJobStoreList.sort((a, b) => a.createdAt > b.createdAt ? 1: -1)

            if (duplicateJobDetailsList.length > 0) {

            } else {
                this.glabalContainer.getRepoContainer().getJobStoreRepo().updateJobStoreBulk(duplicateJobStoreList)
                    .then()
                    .catch()
            }

        })
    }
}