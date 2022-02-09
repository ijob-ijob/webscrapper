import { PlatformType } from '../domain/constant/platform_type'
import { JobStoreRepo } from '../database/job_store_repo'
import { JobStoreEntity } from '../domain/job_store'
import Platform from '@/domain/platform'
import { Careers24Scrapper } from './careers24_scrapper'
import { PlatformRepo } from '../database/platform_repo'

export class Careers24JobStore {
     platform = PlatformType.CAREERS24;

     async importJobStores () {
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

       const JobStoreLinksList: string[] = jobStoreList.map((jobStore) => JSON.parse(JSON.stringify(jobStore)).LINK)

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
                 JSON.stringify({link : link}),
                 JSON.parse(JSON.stringify(platform)).PLATFORM_ID
               ]
           )
         })
         await jobStoreRepo.saveJobStore(jobStoreList)
       }
     }
}
