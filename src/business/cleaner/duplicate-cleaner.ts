import { GlobalContainer } from '../../container/global-container'
import { JobStoreEntity } from '../../domain/entities/job-store'
import { JobStoreStatusType } from '../../domain/constant/job-store-status-type'
import logging from '../../config/logging'

const NAMESPACE = 'DuplicateCleaner'
export class DuplicateCleaner {
  constructor (private globalContainer: GlobalContainer) {
  }

  public async cleanDuplicates (): Promise<void> {
    const duplicateJobStoreList: JobStoreEntity[] = []

    await this.globalContainer.getRepoContainer().getJobStoreRepo().getDuplicates(20)
      .then((jobStoreDuplicateListRes: JobStoreEntity[]) => {
        duplicateJobStoreList.push(...jobStoreDuplicateListRes)
      }).catch((error) => {
        logging.error(NAMESPACE, 'An error occurred while fetching duplicate job stores', error)
        return new Promise((resolve, reject) => reject(new Error(`An error occurred while fetching duplicate job stores for ${NAMESPACE}::error::${error}`)))
      })

    if (duplicateJobStoreList.length === 0) {
      logging.info(NAMESPACE, 'No duplicate job stores found for processing')
      return new Promise((resolve) => resolve())
    }

    duplicateJobStoreList.forEach((duplicateJobStore) => {
      duplicateJobStore.status = JobStoreStatusType.DUPLICATE
    })

    duplicateJobStoreList.sort((a, b) => a.createdAt > b.createdAt ? 1: -1)

    if (duplicateJobStoreList.length > 0) {
      await this.globalContainer.getRepoContainer()
        .getDetailsStoreJobRepo().updateJobStoreAndDeleteJobDetailsDuplicates(duplicateJobStoreList)
        .then(() => {
          logging.info(NAMESPACE, 'Finished processing duplicates')
        }).catch((error) => {
          logging.error(NAMESPACE, 'An error occurred while processing duplicate job store/details')
          return new Promise((resolve, reject) => reject(new Error(`An error occurred while processing duplicate job store/details::${error}`)))
        })
    } else {
      await this.globalContainer.getRepoContainer().getJobStoreRepo().updateJobStoreBulk(duplicateJobStoreList)
        .then(() => {
          logging.info(NAMESPACE, 'Successfully updated duplicate job stores')
        }).catch((error) => {
          logging.error(NAMESPACE, 'An error occurred while updating job store duplicates')
          return new Promise((resolve, reject) => reject(new Error(`An error occurred while updating job store duplicates, ${NAMESPACE}::error::${error}`)))
        })
    }

    return new Promise((resolve) => resolve())
  }
}
