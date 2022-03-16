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
            const duplicateJobStoreList: JobStoreEntity[] = []

            await this.glabalContainer.getRepoContainer().getJobStoreRepo().getDuplicates(20)
                .then((jobStoreDuplicateListRes: JobStoreEntity[]) => {
                    duplicateJobStoreList.push(...jobStoreDuplicateListRes)
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

            duplicateJobStoreList.forEach((duplicateJobStore) => {
                duplicateJobStore.status = JobStoreStatusType.DUPLICATE
            })

            duplicateJobStoreList.sort((a, b) => a.createdAt > b.createdAt ? 1: -1)

            if (duplicateJobStoreList.length > 0) {
                await this.glabalContainer.getRepoContainer()
                    .getDetailsStoreJobRepo().updateJobStoreAndDeleteJobDetailsDuplicates(duplicateJobStoreList)
                    .then(() => {
                       logging.info(NAMESPACE, 'Finished processing duplicates')
                        return resolve()
                    }).catch((error) => {
                        logging.error(NAMESPACE, 'An error occured while processing duplicate job store/details')
                    return reject(new Error(`An error occured while processing duplocate job store/details::${error}`))
                })
            } else {
                await this.glabalContainer.getRepoContainer().getJobStoreRepo().updateJobStoreBulk(duplicateJobStoreList)
                    .then(() => {
                       logging.info(NAMESPACE, 'Successfully updated duplicate job stores')
                        return resolve()
                    }).catch((error) => {
                      logging.error(NAMESPACE, 'An error occured while updating job store duplicates')
                    return reject(`An error occured while updating job store duplicates, ${NAMESPACE}::error::${error}`)
                })
            }

        })
    }
}