import { GlobalContainer } from '../../container/global-container'
import { JobStoreEntity } from '../../domain/entities/job-store'
import { JobStoreRepo } from '../../database/job-store-repo'
import { Platform } from '../../domain/entities/platform'
import { PlatformType } from '../../domain/constant/platform-type'
import { JobDetails } from '../../domain/entities/job-details'
import { JobStoreStatusType } from '../../domain/constant/job-store-status-type'
import { DetailsStoreJobRepo } from '../../database/details-store-job-repo'
import logging from '../../config/logging'

const NAMESPACE = 'Careers24JobDetailsImporter'
export class Careers24JobDetailsImporter {

    constructor(private globalContainer: GlobalContainer) {
    }

    public async import(): Promise<void> {
        const that = this
        return await new Promise<void>((async (resolve, reject) => {

            let platform: Platform
            await that.globalContainer.getRepoContainer().getPatormRepo().getPlatformInfo(PlatformType.CAREERS24)
                .then((platformRes: Platform) => {
                    platform = platformRes
                })
                .catch((error) => {
                    logging.error(NAMESPACE, `An error occured while getting platform for ${NAMESPACE}`, error)
                    return reject(new Error(`An error occured while getting platform record for ${NAMESPACE}, error::${error}`))
                })

            const jobStoreRepo: JobStoreRepo = that.globalContainer.getRepoContainer().getJobStoreRepo();
            let jobStoreList: JobStoreEntity[]
            //todo change and make this configurable
            await jobStoreRepo.getJobStoreNotProcessed(platform.platformId, 35)
                .then((jobStoreEntityList: JobStoreEntity[]) => {
                    jobStoreList = jobStoreEntityList})
                .catch((error) => {
                    logging.error(NAMESPACE, 'An error occured while fetching job stores not processing', error)
                    return reject(new Error(`An error occured while fetching job stores not processsing, ${error}`))
                })

            if (!jobStoreList || jobStoreList.length == 0) {
                return resolve()
            }

            const jobDetailsList: JobDetails[] = []

            await (async () => {
                for (let i = 0; i < jobStoreList.length; i++) {
                    let jobDetails: JobDetails;
                    await that.globalContainer.getScrapperContainer()
                        .getCareers24JobDetailsScrapper()
                        .getJobDetails(jobStoreList[i].link, jobStoreList[i].jobStoreId, platform.platformId)
                        .then((jobDetailsRes) => {
                            jobDetailsList.push(jobDetailsRes)
                            jobStoreList[i].status = JobStoreStatusType.PROCESSED
                        })
                        .catch((error) => {
                            logging.warn(NAMESPACE, 'An occur occured while fetching job details', [jobStoreList[i], error])
                            jobStoreList[i].status = JobStoreStatusType.ERROR
                        })
                }
            })()

            this.globalContainer.getJobSaverContainer()
                .getJobDetailsSaver().saveJobDetails(jobDetailsList, jobStoreList)
                .then(() => {
                    logging.info(NAMESPACE, 'Successfully saved job details list and/or job store list')
                    return resolve()
                }).catch((error) => {
                    logging.error(NAMESPACE, `An error occoured while saving job details list and/or job store list`, error)
                    return reject(new Error(`An error occured while saving job details list/or job store list for ${NAMESPACE}, error::${error}`))
                })
            return resolve()
        }))
    }
}