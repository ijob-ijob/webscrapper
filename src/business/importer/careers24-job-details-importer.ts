import { GlobalContainer } from '../../container/global-container'
import { JobStoreEntity } from '../../domain/entities/job-store'
import { JobStoreRepo } from '../../database/job-store-repo'
import { Platform } from '../../domain/entities/platform'
import { PlatformType } from '../../domain/constant/platform-type'
import { JobDetails } from '../../domain/entities/job-details'
import { JobStoreStatusType } from '../../domain/constant/job-store-status-type'
import logging from '../../config/logging'

const NAMESPACE = 'Careers24JobDetailsImporter'
export class Careers24JobDetailsImporter {
  constructor (private globalContainer: GlobalContainer) {}

  public async import (): Promise<void> {
    let platform: Platform
    await this.globalContainer.getRepoContainer()
      .getPlatformRepo().getPlatformInfo(PlatformType.CAREERS24)
      .then((platformRes: Platform) => {
        platform = platformRes
      }).catch((error) => {
        logging.error(NAMESPACE, `An error occurred while getting platform for ${NAMESPACE}`, error)
        return new Promise((resolve, reject) => reject(new Error(`An error occurred while getting platform record for ${NAMESPACE}, error::${error}`)))
      })

    const jobStoreRepo: JobStoreRepo = this.globalContainer.getRepoContainer().getJobStoreRepo()
    let jobStoreList: JobStoreEntity[]
    // todo change and make this configurable
    await jobStoreRepo.getJobStoreNotProcessed(platform.platformId, 50)
      .then((jobStoreEntityList: JobStoreEntity[]) => {
        jobStoreList = jobStoreEntityList
      }).catch((error) => {
        logging.error(NAMESPACE, 'An error occurred while fetching job stores not processing', error)
        return new Promise((resolve, reject) => reject(new Error(`An error occurred while fetching job stores not processing, ${error}`)))
      })

    if (!jobStoreList || jobStoreList.length === 0) {
      return new Promise((resolve) => resolve())
    }

    const jobDetailsList: JobDetails[] = []

    await (async () => {
      for (let i = 0; i < jobStoreList.length; i++) {
        await this.globalContainer.getScrapperContainer()
          .getCareers24JobDetailsScrapper()
          .getJobDetails(jobStoreList[i].link, jobStoreList[i].jobStoreId, platform.platformId)
          .then((jobDetailsRes) => {
            jobDetailsList.push(jobDetailsRes)
            jobStoreList[i].status = JobStoreStatusType.PROCESSED
          })
          .catch((error) => {
            logging.warn(NAMESPACE, 'An occur occurred while fetching job details', [jobStoreList[i], error])
            jobStoreList[i].status = JobStoreStatusType.ERROR
          })
      }
    })()

    await this.globalContainer.getJobSaverContainer().getJobDetailsSaver().saveJobDetails(jobDetailsList, jobStoreList)
      .then(() => {
        logging.info(NAMESPACE, 'Successfully saved job details list and/or job store list')
      }).catch((error) => {
        logging.error(NAMESPACE, 'An error occurred while saving job details list and/or job store list', error)
        return new Promise((resolve, reject) => reject(new Error(`An error occurred while saving job details list/or job store list for ${NAMESPACE}, error::${error}`)))
      })

    return new Promise((resolve) => resolve())
  }
}
