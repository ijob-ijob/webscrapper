import { GlobalContainer } from '../../container/global-container'
import { JobStoreStatusType } from '../../domain/constant/job-store-status-type'
import { JobStoreEntity } from '../../domain/entities/job-store'
import logging from '../../config/logging'

const NAMESPACE = 'JobStoreSaver'

export class JobStoreSaver {
  constructor (private globalContainer: GlobalContainer) {
  }

  public async saveJobStores (linkLists: string[], platformId: number, platformName: string): Promise<void> {
    const jobStoreRepo = this.globalContainer.getRepoContainer().getJobStoreRepo()

    const jobStoreList: JobStoreEntity[] = []
    await jobStoreRepo.getJobStoreByPlatformName(platformName)
      .then((jobStoreListResults) => jobStoreList.push(...jobStoreListResults))
      .catch((error) => {
        logging.error(NAMESPACE, 'An error occurred while getting job stores by platform', error)
        return new Promise((resolve, reject) => reject(new Error(`An error occurred while getting job stores by platform, ${error}`)))
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
          return jobStoreList.push(
            [link,
              JSON.stringify({ link: link }),
              platformId,
              JobStoreStatusType.NOT_PROCESSED
            ]
          )
        })

        await jobStoreRepo.saveJobStore(jobStoreList).then(() => {
          logging.info(NAMESPACE, 'Finished saving job stores')
        }).catch((error) => {
          if (error.toString().includes('Duplicate')) {
            isDuplicateError = true
            const duplicate: string = JobStoreSaver.getDuplicate(error.toString())
            newLinksList = JobStoreSaver.removeDuplicate(newLinksList, duplicate)
          } else {
            logging.error(NAMESPACE, 'An error occurred while saving job stores', error)
            return new Promise((resolve, reject) => reject(new Error(`An error occurred while saving job stores, ${error}`)))
          }
        })
      }
    } while (isDuplicateError && newLinksList.length !== 0)
    return new Promise((resolve) => resolve())
  }

  private static removeDuplicate (links: string[], duplicateLink: string): string[] {
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

  private static getDuplicate (input: string): string {
    const tempResults: string = input.substring(input.indexOf('https://'))
    return tempResults.substring(0, tempResults.indexOf('\''))
  }
}
