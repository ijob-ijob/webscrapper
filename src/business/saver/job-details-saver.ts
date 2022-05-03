import { JobStoreEntity } from '../../domain/entities/job-store'
import { JobDetails } from '../../domain/entities/job-details'
import { DetailsStoreJobRepo } from '../../database/details-store-job-repo'
import { GlobalContainer } from '../../container/global-container'

import logging from '../../config/logging'

const NAMESPACE = 'JobDetailsSaver'

export class JobDetailsSaver {
  constructor (private globalContainer: GlobalContainer) {
  }

  public async saveJobDetails (jobDetailsList: JobDetails[], jobStoreList: JobStoreEntity[]): Promise<void> {
    const jobDetailsToBeSavedList: any[] = []
    jobDetailsList.forEach((jobDetails) => {
      jobDetailsToBeSavedList.push([
        jobDetails.title,
        jobDetails.link,
        jobDetails.type,
        jobDetails.platformId,
        jobDetails.reference,
        jobDetails.salaryMin,
        jobDetails.salaryMax,
        jobDetails.location,
        jobDetails.closingDate,
        jobDetails.employer,
        jobDetails.jobStoreId
      ])
    })

    if (jobDetailsToBeSavedList.length > 0) {
      const detailsStoreJobRepo: DetailsStoreJobRepo = new DetailsStoreJobRepo()
      await detailsStoreJobRepo.saveJobDetailsAndUpdateJobStore(jobDetailsToBeSavedList, jobStoreList)
        .then(() => {
          logging.info(NAMESPACE, 'Successfully added job details')
        }).catch((error) => {
          logging.error(NAMESPACE, 'An error occurred while saving job details', error)
          return new Promise((resolve, reject) => reject(new Error(`An error occurred while saving job details, ${error}`)))
        })
    } else {
      await this.globalContainer.getRepoContainer().getJobStoreRepo().updateJobStoreBulk(jobStoreList)
        .then(() => {
          logging.info(NAMESPACE, 'Finished updating job store failures')
        })
        .catch((error) => {
          logging.error(NAMESPACE, 'An error occurred while saving job details', error)
          return new Promise((resolve, reject) => reject(new Error('An error occurred while updating job store failures')))
        })
    }

    return new Promise((resolve) => resolve())
  }
}
