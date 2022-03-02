import { JobStoreEntity, JobStore } from '../../domain/entities/job_store'
import { JobStoreRepo } from '../../database/job_store_repo'
import { PlatformRepo } from '../../database/platform_repo'
import { PlatformType } from '../../domain/constant/platform_type'
import { JobDetails } from '../../domain/entities/job_details'
import { JobDetailsRepo } from '../../database/job_details_repo'
import { Platform } from '../../domain/entities/platform'
import { DetailsStoreJobRepo } from '../../database/details_store_job_repo'
import { JobStoreStatusType } from '../../domain/constant/job_store_status_type'
import { GlobalContainer } from '../../container/global_container'
import { Careers24JobDetailsScrapper } from '../scrapper/careers24_job_details_scrapper'

import logging from '../../config/logging'

const NAMESPACE = 'JobDetailsSaver'

export class JobDetailsSaver {

    constructor(private globalContainer: GlobalContainer) {
    }

    public async saveJobDetails(jobDetailsList: JobDetails[], jobStoreList: JobStoreEntity[]): Promise<void> {
        const that = this
        return await new Promise<void>(async function (resolve, reject) {

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
                    .then(() => logging.info(NAMESPACE, 'Successully added job details'))
                    .catch((error) => {
                        logging.error(NAMESPACE, `An error occured while saving job details`, error)
                        return reject(new Error(`An error occured while saving job details, ${error}`))
                    })
            } else {
                await that.globalContainer.getRepoContainer().getJobStoreRepo().updateJobStoreBulk(jobStoreList)
                    .then(() => logging.info(NAMESPACE, 'Finished updating job store failures'))
                    .catch((error) => {
                        logging.error(NAMESPACE, `An error occured while saving job details`, error)
                        return reject(new Error(`An error occured while updating job store failures`))
                    })
            }
        })

    }

}