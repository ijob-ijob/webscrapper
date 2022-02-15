import { JobStoreEntity, JobStore } from '../domain/job_store'
import { JobStoreRepo } from '../database/job_store_repo'
import { PlatformRepo } from '../database/platform_repo'
import { PlatformType } from '../domain/constant/platform_type'
import { JobDetails } from '../domain/job_details'
import { Careers24Scrapper } from '../business/careers24_scrapper'
import { JobDetailsRepo } from '../database/job_details_repo'
import { Platform } from '../domain/platform'
import { DetailsStoreJobRepo } from '../database/details_store_job_repo'

import logging from '../config/logging'

const NAMESPACE = 'JobDetailsSaver'

export class JobDetailsSaver {

    public async processJobStoreToJobDetails(): Promise<string> {
        return await new Promise<string>(async function (resolve, reject) {

            const jobStoreRepo: JobStoreRepo = new JobStoreRepo();
            let jobStoreList: JobStoreEntity[]
            //change and make this configurable
            await jobStoreRepo.getJobStoreNotProcessed(5).then((jobStoreEntityList) => {
                jobStoreList = jobStoreEntityList
            }).catch((error) => {
                logging.error(NAMESPACE, 'An error occured while fetching job stores not processing', error)
                return reject(new Error(`An error occured while fetching job stores not processsing, ${error}`))
            })

            const platformRepo: PlatformRepo = new PlatformRepo()
            let platformList: Platform[]
            await platformRepo.getAllActivePlatforms().then((allActivePlatformsList) => {
                platformList = allActivePlatformsList
            }).catch((error) => {
                logging.error(NAMESPACE, 'An error occured while fetching all active platforms')
                return reject(new Error(`An error occurred while fetching all active platforms ${error}`))
            })

            const jobDetailsList: JobDetails[] = []
            for (let i = 0; i < jobStoreList.length; i++) {

                let platform: Platform = null
                platformList.forEach((platformInput) => {
                    if (platformInput.platformId === jobStoreList[i].platformId) {
                        platform = platformInput
                    }
                })

                if (!platform) {
                    logging.warn(NAMESPACE, 'Could not process job store, no matching platform', jobStoreList[i])
                    continue
                }

                const careers24Scrapper: Careers24Scrapper = new Careers24Scrapper()
                switch (platform.name) {
                    case PlatformType.CAREERS24:
                        try {
                            let jobDetails: JobDetails = await careers24Scrapper.getJobDetails(
                                jobStoreList[i].link,
                                jobStoreList[i].jobStoreId,
                                platform.platformId)
                            jobDetailsList.push(jobDetails)
                        } catch (error) {
                            logging.warn(NAMESPACE, 'An occur occured while fetching job details', error)
                        }
                        break
                    default:
                        logging.warn(NAMESPACE, 'No job details implementation found', [jobStoreList[i], platform])
                        break
                }
            }

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
            }
        })

    }

}