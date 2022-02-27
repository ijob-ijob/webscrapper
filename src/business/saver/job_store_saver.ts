import { PlatformRepo } from '../../database/platform_repo'
import { Platform } from '../../domain/entities/platform'
import { SchedulerConfType } from '../../domain/constant/scheduler_conf_types'
import { Careers24JobStoreScrapper } from '../scrapper/careers24_job_store_scrapper'
import { GlobalContainer } from '../../container/global_container'
import { JobStoreStatusType } from '../../domain/constant/job_store_status_type'
import { JobStore } from '../../domain/entities/job_store'
import logging from '../../config/logging'

const NAMESPACE = 'JobStoreSaver'

export class JobStoreSaver {

    constructor(private globalContainer: GlobalContainer) {}

    public async importJobStores(): Promise<void> {

        return await new Promise<void>((async (resolve, reject) => {
            let platformList: Platform[]
            const platformRepo: PlatformRepo = new PlatformRepo()

            await platformRepo.getAllActivePlatforms().then((allActivePlatformsList) => {
                platformList = allActivePlatformsList
            }).catch((error) => {
                logging.error(NAMESPACE, 'An error occured while fetching all active platforms')
                return reject(new Error(`An error occurred while fetching all active platforms ${error}`))
            })

            for (let i = 0; i < platformList.length; i++) {
                switch (platformList[i].name) {
                    case SchedulerConfType.CAREERS24JOBSTOREIMPORTER:
                        break
                    default:
                        logging.warn(NAMESPACE, 'Found a platform type that has no matching config')
                        break
                }
            }

        }))

        const careers24JobStoreScrapper: Careers24JobStoreScrapper = new Careers24JobStoreScrapper()
        const linkLists = await careers24JobStoreScrapper.getLinks()

    }

    private async processLinksToJobStore(platform: Platform, linkLists: string[]): Promise<void> {
        return await new Promise<void>((async (resolve, reject) => {
            const jobStoreRepo = this.globalContainer.getRepoContainer().getJobStoreRepo()

            const jobStoreList: JobStore[] = []
            await jobStoreRepo.getJobStoreByPlatformName(platform.name)
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
                            platform.platformId,
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