import { JobStoreEntity } from '../domain/job_store'
import { JobStoreRepo } from '../database/job_store_repo'
import { PlatformRepo } from '../database/platform_repo'
import Platform from '../domain/platform'
import { PlatformType } from '../domain/constant/platform_type'
import { JobDetails } from '../domain/job_details'
import { Careers24Scrapper } from '../business/careers24_scrapper'
import { JobDetailsRepo } from '../database/job_details_repo'

import logging from '../config/logging'

const NAMESPACE = 'JobDetailsSaver'
export class JobDetailsSaver {

    public async processJobStoreToJobDetails(): Promise<string> {
        return new Promise<string>(async function (resolve, reject) {
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
                let platform = this.getPlatorm(jobStoreList[i], platformList)
                if (!platform) {
                    logging.warn(NAMESPACE, 'Could not process job store, no matching platform', jobStoreList[i])
                    continue
                }

                const careers24Scrapper: Careers24Scrapper = new Careers24Scrapper()
                switch (platform.name) {
                    case PlatformType.CAREERS24:
                        let jobDetails: JobDetails = await careers24Scrapper.getJobDetails(jobStoreList[i].link)
                        jobDetailsList.push(jobDetails)
                    break
                    default:
                        logging.warn(NAMESPACE, 'No job details implementation found', [jobStoreList[i], platform])
                    break
                }
            }

            const jobDetailsRepo: JobDetailsRepo = new JobDetailsRepo()
            await jobDetailsRepo.saveJobDetails(jobDetailsList).then((response) => {
                logging.info(NAMESPACE, 'Successfully inserted job details')
            }).catch((error) => {
                logging.error(NAMESPACE, 'Failed to insert job details list')
                reject(`Failed to insert job details list, ${error}`)
            })

            //todo continue to do bulk update on job store
        })

    }

     private getPlatorm(jobStore: JobStoreEntity, platformList: Platform[]): Platform {
        platformList.forEach((platformInput) => {
            if (platformInput.platformId === jobStore.platformId) {
               return platformInput
            }
        })

        return null
    }

}