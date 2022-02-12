import { JobStoreEntity, JobStore } from '../domain/job_store'
import { JobStoreRepo } from '../database/job_store_repo'
import { PlatformRepo } from '../database/platform_repo'
import { PlatformType } from '../domain/constant/platform_type'
import { JobDetails } from '../domain/job_details'
import { Careers24Scrapper } from '../business/careers24_scrapper'
import { JobDetailsRepo } from '../database/job_details_repo'
import { format } from 'fecha';
import Platform from '../domain/platform'

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
                    reject(new Error(`An error occured while fetching job stores not processsing, ${error}`))
                })

            const platformRepo: PlatformRepo = new PlatformRepo()
            let platformList: Platform[]
            await platformRepo.getAllActivePlatforms().then((allActivePlatformsList) => {
                platformList = allActivePlatformsList
            }).catch((error) => {
                logging.error(NAMESPACE, 'An error occured while fetching all active platforms')
                reject(new Error(`An error occurred while fetching all active platforms ${error}`))
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
                switch (JSON.parse(JSON.stringify(platform)).NAME) {
                    case PlatformType.CAREERS24:
                        try {
                            let jobDetails: JobDetails = await careers24Scrapper.getJobDetails(
                                JSON.parse(JSON.stringify(jobStoreList[i])).LINK,
                                JSON.parse(JSON.stringify(jobStoreList[i])).JOB_STORE_ID,
                                JSON.parse(JSON.stringify(platform)).PLATFORM_ID)
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
                const jobDetailsRepo: JobDetailsRepo = new JobDetailsRepo()
                await jobDetailsRepo.saveJobDetails(jobDetailsToBeSavedList).then(async (response) => {
                    logging.info(NAMESPACE, 'Successfully inserted job details')
                    await jobStoreRepo.updateJobStoreBulk(jobStoreList).then(() => {
                        logging.info(NAMESPACE, 'successfully updated job store bulk')
                    }).catch((error) => {
                        logging.error(NAMESPACE, 'An error occured while updating bulk job store')
                        return reject(`Failed to update job store bulk ${error}`)
                    })
                }).catch((error) => {
                    logging.error(NAMESPACE, 'Failed to insert job details list')
                    return reject(`Failed to insert job details list, ${error}`)
                })
            }
        })

    }

}