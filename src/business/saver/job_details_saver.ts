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
import * as Console from "console";

const NAMESPACE = 'JobDetailsSaver'

export class JobDetailsSaver {

    constructor(private globalContainer: GlobalContainer) {}

    public async processJobStoreToJobDetails(): Promise<string> {
        const that = this
        return await new Promise<string>(async function (resolve, reject) {
            const jobStoreRepo: JobStoreRepo = new JobStoreRepo();
            let jobStoreList: JobStoreEntity[]
            //todo change and make this configurable
            await jobStoreRepo.getJobStoreNotProcessed(5).then((jobStoreEntityList: JobStoreEntity[]) => {
                jobStoreList = jobStoreEntityList
            }).catch((error) => {
                logging.error(NAMESPACE, 'An error occured while fetching job stores not processing', error)
                return reject(new Error(`An error occured while fetching job stores not processsing, ${error}`))
            })

            if (!jobStoreList || jobStoreList.length == 0) {
                return resolve('****No job stores to process****')
            }

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

                switch (platform.name) {
                    case PlatformType.CAREERS24:
                        try {
                            const careers24JobDetailsScrapper: Careers24JobDetailsScrapper = that.globalContainer.getScrapperContainer().getCareers24JobDetailsScrapper()
                            let jobDetails: JobDetails = await careers24JobDetailsScrapper.getJobDetails(
                                jobStoreList[i].link,
                                jobStoreList[i].jobStoreId,
                                platform.platformId)
                            jobDetailsList.push(jobDetails)
                            jobStoreList[i].status = JobStoreStatusType.PROCESSED
                        } catch (error) {
                            logging.warn(NAMESPACE, 'An occur occured while fetching job details', error)
                            jobStoreList[i].status = JobStoreStatusType.ERROR
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
            } else {
                await jobStoreRepo.updateJobStoreBulk(jobStoreList)
                    .then(() => logging.info(NAMESPACE, 'Finished updating job store failures'))
                    .catch((error) => {
                        logging.error(NAMESPACE, `An error occured while saving job details`, error)
                        return reject(new Error(`An error occured while updating job store failures`))
                    })
            }
        })

    }

}