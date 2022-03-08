import { PlatformRepo } from '../../database/platform-repo'
import { Platform } from '../../domain/entities/platform'
import { SchedulerConfType } from '../../domain/constant/scheduler-conf-types'
import { Careers24JobStoreScrapper } from '../scrapper/careers24-job-store-scrapper'
import { GlobalContainer } from '../../container/global-container'
import { JobStoreStatusType } from '../../domain/constant/job-store-status-type'
import { JobStoreEntity } from '../../domain/entities/job-store'
import { PlatSchedConf } from '../../domain/entities/plat-sched-conf'
import logging from '../../config/logging'

const NAMESPACE = 'JobStoreSaver'

export class JobStoreSaver {

    constructor(private globalContainer: GlobalContainer) {
    }

    public async saveJobStores(linkLists: string[], platformId: number, platformName: string): Promise<void> {
        const that = this
        return await new Promise<void>((async (resolve, reject) => {
            const jobStoreRepo = this.globalContainer.getRepoContainer().getJobStoreRepo()

            const jobStoreList: JobStoreEntity[] = []
            await jobStoreRepo.getJobStoreByPlatformName(platformName)
                .then((jobStoreListResults) => jobStoreList.push(...jobStoreListResults))
                .catch((error) => {
                    logging.error(NAMESPACE, `An error occured while getting job stores by platform`, error)
                    return reject(`An error occured while getting job stores by platform, ${error}`)
                })

            const JobStoreLinksList: string[] = jobStoreList.map((jobStore) => jobStore.link)

            let newLinksList: string[] = []

            linkLists.forEach(function (link) {
                if (!JobStoreLinksList.includes(link)) {
                    newLinksList.push(link)
                }
            })

            let isDuplicateError: boolean = false

            do {
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
                    await jobStoreRepo.saveJobStore(jobStoreList).then(()=> {
                        return resolve()
                    }).catch((error) => {
                        if (error.toString().includes('Duplicate')) {
                            isDuplicateError = true
                            const duplicate: string = that.getDuplicate(error.toString())
                            newLinksList = that.removeDupilicate(newLinksList, duplicate)
                        } else {
                            logging.error(NAMESPACE, `An error occured while saving job stores`, error)
                            return reject(`An error occured while saving job stores, ${error}`)
                        }
                    })
                }
            } while (isDuplicateError && newLinksList.length != 0)
            return resolve()
        }))
    }

    private removeDupilicate(links: string[], duplicateLink: string): string[] {
        let index
        for (let i = 0; i < links.length; i++) {
            if (links[i].includes(duplicateLink)) {
                index = i
            }
        }
        if (index === -1) {
            logging.warn(NAMESPACE, 'dupliicate link detected but not found in list of links', [duplicateLink])
            return links
        }

        return links.splice(index, 1)
    }

    private getDuplicate(input: string): string {
        let tempResults: string = input.substring(input.indexOf('https://'))
        return tempResults.substring(0, tempResults.indexOf('\''))
    }

}