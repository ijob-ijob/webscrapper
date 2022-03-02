import { PlatformRepo } from '../../database/platform-repo'
import { Platform } from '../../domain/entities/platform'
import { SchedulerConfType } from '../../domain/constant/scheduler-conf-types'
import { Careers24JobStoreScrapper } from '../scrapper/careers24-job-store-scrapper'
import { GlobalContainer } from '../../container/global-container'
import { JobStoreStatusType } from '../../domain/constant/job-store-status-type'
import { JobStore } from '../../domain/entities/job-store'
import { PlatSchedConf } from '../../domain/entities/plat-sched-conf'
import logging from '../../config/logging'

const NAMESPACE = 'JobStoreSaver'

export class JobStoreSaver {

    constructor(private globalContainer: GlobalContainer) {
    }

    public async saveJobStores(linkLists: string[], platformId: number, platformName: string): Promise<void> {
        return await new Promise<void>((async (resolve, reject) => {
            const jobStoreRepo = this.globalContainer.getRepoContainer().getJobStoreRepo()

            const jobStoreList: JobStore[] = []
            await jobStoreRepo.getJobStoreByPlatformName(platformName)
                .then((jobStoreListResults) => jobStoreList.push(...jobStoreListResults))
                .catch((error) => {
                    logging.error(NAMESPACE, `An error occured while getting job stores by platform`, error)
                    return reject(`An error occured while getting job stores by platform, ${error}`)
                })

            const JobStoreLinksList: string[] = jobStoreList.map((jobStore) => jobStore.link)

            const newLinksList: string[] = []

            linkLists.forEach(function (link) {
                if (!JobStoreLinksList.includes(link)) {
                    newLinksList.push(link)
                }
            })

            if (newLinksList.length > 0) {

                const jobStoreList: any[] = []
                newLinksList.map((link) => {
                    jobStoreList.push(
                        [link,
                            JSON.stringify({link: link}),
                            platformId,
                            JobStoreStatusType.NOT_PROCESSED
                        ]
                    )
                })
                await jobStoreRepo.saveJobStore(jobStoreList).catch((error) => {
                    logging.error(NAMESPACE, `An error occured while saving job stores`, error)
                    return reject(`An error occured while saving job stores, ${error}`)
                })
            }
        }))
    }

}