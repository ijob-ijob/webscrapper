import { PlatformType } from '../../domain/constant/platform_type'
import { JobStoreRepo } from '../../database/job_store_repo'
import { JobStoreEntity } from '../../domain/entities/job_store'
import { Platform } from '../../domain/entities/platform'
import { Careers24Scrapper } from './careers24_scrapper'
import { PlatformRepo } from '../../database/platform_repo'
import { JobStoreStatusType } from '../../domain/constant/job_store_status_type'

export class Careers24JobStoreScrapper {
    platform = PlatformType.CAREERS24;

    public async importJobStores() {
        /**
         * 1. Get job stores from careers24, 10 items at a time.
         * 2. Retrieve possible matches.
         * 3. if match found in possible matches do not add to new list, otherwise add to new list.
         * 4. Take new list and save it and repeat from step 1.
         * */

        const careers24Scrapper: Careers24Scrapper = new Careers24Scrapper()
        const linkLists = await careers24Scrapper.getLinks()

        const jobStoreRepo: JobStoreRepo = new JobStoreRepo()
        const jobStoreList = await jobStoreRepo.getJobStoreByJobLinksAndPlatform(this.platform)

        const JobStoreLinksList: string[] = jobStoreList.map((jobStore) => jobStore.link)

        const newLinksList: string[] = []

        linkLists.forEach(function (link) {
            if (!JobStoreLinksList.includes(link)) {
                newLinksList.push(link)
            }
        })

        const platformRepo: PlatformRepo = new PlatformRepo()

        const platform: Platform = await platformRepo.getPlatformInfo(this.platform)

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
            await jobStoreRepo.saveJobStore(jobStoreList)
        }
    }
}
