import { PlatformType } from '../domain/constant/platform_type'
import { JobStoreRepo } from '../database/job_store_repo'
import { JobStoreEntity } from '../domain/job_store'
import Platform from '@/domain/platform'

export class Careers24JobStore {
     platform = PlatformType.CAREERS24;

     async importJobStores () {
       /**
         * 1. Get job stores from careers24, 10 items at a time.
         * 2. Retrieve possible matches.
         * 3. if match found in possible matches do not add to new list, otherwise add to new list.
         * 4. Take new list and save it and repeat from step 1.
         * */

       // todo substitute with functionality  for getting links
       const linkLists = [
         'https://www.careers24.com/jobs/adverts/1837030-executive-assistant-pretoria/?jobindex=1',
         'https://www.careers24.com/jobs/adverts/1837029-trg-1671-newcastle-signage-designer-applicator-durban-north-coast/?jobindex=2',
         'https://www.careers24.com/jobs/adverts/1837028-trg-1671-newcastle-signage-designer-applicator-mpumalanga/?jobindex=3',
         'https://www.careers24.com/jobs/adverts/1837027-trg-1671-newcastle-signage-designer-applicator-kwazulu-natal/?jobindex=4',
         'https://www.careers24.com/jobs/adverts/1837026-trg-1671-newcastle-signage-designer-applicator-gauteng/?jobindex=5',
         'https://www.careers24.com/jobs/adverts/1837025-trg-1671-newcastle-signage-designer-applicator-drakensberg/?jobindex=6',
         'https://www.careers24.com/jobs/adverts/1837024-middle-level-sales-hardware-retail-johannesburg/?jobindex=7',
         'https://www.careers24.com/jobs/adverts/1837023-middle-level-sales-hardware-retail-johannesburg/?jobindex=8',
         'https://www.careers24.com/jobs/adverts/1837022-senior-internal-sales-hardware-shopfitting-kimberley/?jobindex=9',
         'https://www.careers24.com/jobs/adverts/1837021-entry-level-sales-hardware-durban/?jobindex=10'
       ]

       const jobStoreRepo: JobStoreRepo = new JobStoreRepo()

       const jobStoreList = await jobStoreRepo.getJobStoreByJobLinksAndPlatform(linkLists, this.platform)

       console.log(jobStoreList)
       const JobStoreLinksList: string[] = jobStoreList.map((jobStore) => JSON.parse(JSON.stringify(jobStore)).LINK)

       const newLinksList: string[] = []

       linkLists.forEach(function (link) {
         if (!JobStoreLinksList.includes(link)) {
           newLinksList.push(link)
         }
       })

       const platform: Platform = await jobStoreRepo.getPlatformInfo(this.platform)

       if (newLinksList.length > 0) {
         
         const jobStoreList = []
         newLinksList.map((link) => {
           jobStoreList.push(
               [link,
                 JSON.stringify({link : link}),
                 10000,
                 new Date().toISOString().slice(0, 19).replace('T', ' ')
               ]
           )
         })
         await jobStoreRepo.saveJobStore(jobStoreList)
       }
     }
}
